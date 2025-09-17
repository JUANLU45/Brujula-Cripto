'use client';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import type { IArticle } from '@brujula-cripto/types';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { auth } from '@/lib/firebase';

import { ArticleContentEditor } from './ArticleContentEditor';
import { ArticleMetadata } from './ArticleMetadata';
import { FeaturedImageSection } from './FeaturedImageSection';
import { LanguageTabs } from './LanguageTabs';

interface ArticleEditorProps {
  articleSlug?: string;
  initialData?: Partial<IArticle>;
  mode?: 'create' | 'edit';
}

interface ArticleFormData {
  slug: string;
  es: {
    title: string;
    contentMarkdown: string;
    excerpt: string;
  };
  en: {
    title: string;
    contentMarkdown: string;
    excerpt: string;
  };
  imageUrl: string;
  authorName: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  status: 'draft' | 'published';
}

interface TabState {
  language: 'es' | 'en';
  section: 'content' | 'metadata';
}

export function ArticleEditor({
  articleSlug,
  initialData,
  mode = 'create',
}: ArticleEditorProps): JSX.Element {
  const t = useTranslations('admin.editor');
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabState>({
    language: 'es',
    section: 'content',
  });

  const [formData, setFormData] = useState<ArticleFormData>({
    slug: '',
    es: {
      title: '',
      contentMarkdown: '',
      excerpt: '',
    },
    en: {
      title: '',
      contentMarkdown: '',
      excerpt: '',
    },
    imageUrl: '',
    authorName: '',
    category: '',
    tags: [],
    isFeatured: false,
    status: 'draft',
    ...initialData,
  });

  const [tagInput, setTagInput] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  // Auth token function - must be declared before useEffect
  const getAuthToken = useCallback(async (): Promise<string> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error(t('errors.notAuthenticated'));
    }
    return user.getIdToken();
  }, [t]);

  // TipTap Editor for Spanish content
  const editorEs = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
    ],
    content: formData.es.contentMarkdown,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateFormData('es', 'contentMarkdown', html);
    },
  });

  // TipTap Editor for English content
  const editorEn = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
    ],
    content: formData.en.contentMarkdown,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateFormData('en', 'contentMarkdown', html);
    },
  });

  // Load article data for editing
  useEffect(() => {
    const loadArticle = async (): Promise<void> => {
      if (mode === 'create' || !articleSlug) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = await getAuthToken();
        const response = await fetch(`/api/admin/articles/${articleSlug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(t('errors.loadFailed'));
        }

        const article: IArticle = (await response.json()) as IArticle;
        setFormData({
          slug: article.slug,
          es: article.es,
          en: article.en,
          imageUrl: article.imageUrl,
          authorName: article.authorName,
          category: article.category,
          tags: article.tags,
          isFeatured: article.isFeatured,
          status: article.status,
        });

        // Update editors content
        editorEs?.commands.setContent(article.es.contentMarkdown);
        editorEn?.commands.setContent(article.en.contentMarkdown);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errors.unknown'));
      } finally {
        setLoading(false);
      }
    };

    void loadArticle();
  }, [articleSlug, mode, t, editorEs, editorEn, getAuthToken]);

  const updateFormData = useCallback((language: 'es' | 'en', field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        [field]: value,
      },
    }));
  }, []);

  const handleInputChange = (field: keyof ArticleFormData, value: string | string[]): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBooleanChange = (field: keyof ArticleFormData, value: boolean): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlugFromTitle = (): void => {
    const title = formData.es.title || formData.en.title;
    if (!title) {
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    handleInputChange('slug', slug);
  };

  const handleAddTag = (): void => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      handleInputChange('tags', [...formData.tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    handleInputChange(
      'tags',
      formData.tags.filter((tag) => tag !== tagToRemove),
    );
  };

  const handleImageUpload = async (file: File): Promise<void> => {
    setImageUploading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error(t('errors.uploadFailed'));
      }

      const result = (await response.json()) as unknown;
      const { imageUrl } = result as { imageUrl: string };
      handleInputChange('imageUrl', imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.uploadFailed'));
    } finally {
      setImageUploading(false);
    }
  };

  const insertImageToEditor = useCallback(
    async (file: File) => {
      setImageUploading(true);

      try {
        const token = await getAuthToken();
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataUpload,
        });

        if (!response.ok) {
          throw new Error(t('errors.uploadFailed'));
        }

        const result = (await response.json()) as unknown;
        const { imageUrl } = result as { imageUrl: string };

        // Insert image into current editor
        const currentEditor = activeTab.language === 'es' ? editorEs : editorEn;
        currentEditor?.chain().focus().setImage({ src: imageUrl }).run();
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errors.uploadFailed'));
      } finally {
        setImageUploading(false);
      }
    },
    [activeTab.language, editorEs, editorEn, t, getAuthToken],
  );

  const generateWithAI = async (
    language: 'es' | 'en',
    field: 'title' | 'excerpt' | 'content',
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      const response = await fetch('/api/admin/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          language,
          field,
          context: {
            category: formData.category,
            tags: formData.tags,
            existingContent: formData[language],
          },
        }),
      });

      if (!response.ok) {
        throw new Error(t('errors.aiFailed'));
      }

      const response_json = (await response.json()) as { content: string };
      const { content } = response_json;

      if (field === 'content') {
        const editor = language === 'es' ? editorEs : editorEn;
        editor?.commands.setContent(content);
      } else {
        updateFormData(language, field, content);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.aiFailed'));
    } finally {
      setLoading(false);
    }
  };

  const validateFormData = (): void => {
    if (!formData.slug.trim()) {
      throw new Error(t('validation.slugRequired'));
    }
    if (!formData.es.title.trim() || !formData.en.title.trim()) {
      throw new Error(t('validation.titlesRequired'));
    }
  };

  const saveArticleData = async (publishNow: boolean): Promise<{ slug: string }> => {
    const token = await getAuthToken();
    const articleData = {
      ...formData,
      status: publishNow ? 'published' : formData.status,
      updatedAt: new Date(),
    };

    const url = mode === 'create' ? '/api/admin/articles' : `/api/admin/articles/${articleSlug}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(t('errors.saveFailed'));
    }

    return (await response.json()) as { slug: string };
  };

  const handlePostSaveNavigation = (publishNow: boolean, resultSlug: string): void => {
    if (publishNow || mode === 'create') {
      router.push('/admin/articles');
    } else if (resultSlug !== articleSlug) {
      router.replace(`/admin/articles/${resultSlug}`);
    }
  };

  const handleSave = async (publishNow = false): Promise<void> => {
    setSaving(true);
    setError(null);

    try {
      validateFormData();
      const result = await saveArticleData(publishNow);
      handlePostSaveNavigation(publishNow, result.slug);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">{t('loading')}</span>
      </div>
    );
  }

  const currentEditor = activeTab.language === 'es' ? editorEs : editorEn;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === 'create' ? t('createTitle') : t('editTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === 'create' ? t('createSubtitle') : t('editSubtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => void handleSave(false)}
            disabled={saving}
            className="bg-gray-600 text-white hover:bg-gray-700"
          >
            {saving ? <Spinner className="mr-2 h-4 w-4" /> : null}
            {t('saveDraft')}
          </Button>
          <Button
            onClick={() => void handleSave(true)}
            disabled={saving}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {saving ? <Spinner className="mr-2 h-4 w-4" /> : null}
            {t('publish')}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Main Content Area */}
        <div className="space-y-6 lg:col-span-3">
          <Card className="p-0">
            <LanguageTabs
              activeLanguage={activeTab.language}
              onLanguageChange={(language) => setActiveTab((prev) => ({ ...prev, language }))}
            />

            <ArticleContentEditor
              language={activeTab.language}
              title={formData[activeTab.language].title}
              excerpt={formData[activeTab.language].excerpt}
              editor={currentEditor}
              loading={loading}
              onTitleChange={(title) => updateFormData(activeTab.language, 'title', title)}
              onExcerptChange={(excerpt) => updateFormData(activeTab.language, 'excerpt', excerpt)}
              onGenerateAI={(field) => void generateWithAI(activeTab.language, field)}
              onInsertImage={(file) => void insertImageToEditor(file)}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ArticleMetadata
            slug={formData.slug}
            authorName={formData.authorName}
            category={formData.category}
            tags={formData.tags}
            isFeatured={formData.isFeatured}
            status={formData.status}
            onSlugChange={(slug) => handleInputChange('slug', slug)}
            onAuthorChange={(author) => handleInputChange('authorName', author)}
            onCategoryChange={(category) => handleInputChange('category', category)}
            onTagsChange={(tags) => handleInputChange('tags', tags)}
            onFeaturedChange={(featured) => handleBooleanChange('isFeatured', featured)}
            onStatusChange={(status) => handleInputChange('status', status)}
          />

          <FeaturedImageSection
            imageUrl={formData.imageUrl}
            imageUploading={imageUploading}
            onImageChange={(url) => handleInputChange('imageUrl', url)}
            onImageUpload={(file) => void insertImageToEditor(file)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button onClick={() => router.back()} className="bg-gray-600 text-white hover:bg-gray-700">
          {t('actions.cancel')}
        </Button>
        <Button
          onClick={() => void handleSave()}
          disabled={saving}
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Spinner className="mr-2 h-4 w-4" /> : null}
          {t('actions.save')}
        </Button>
        <Button
          onClick={() => void handleSave(true)}
          disabled={saving}
          className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? <Spinner className="mr-2 h-4 w-4" /> : null}
          {t('actions.publish')}
        </Button>
      </div>
    </div>
  );
}
