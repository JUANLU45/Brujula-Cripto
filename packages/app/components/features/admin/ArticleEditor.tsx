'use client';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import type { IArticle } from '@brujula-cripto/types';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { auth } from '@/lib/firebase';

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
  }, [articleSlug, mode, t, editorEs, editorEn]);

  const getAuthToken = async (): Promise<string> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error(t('errors.notAuthenticated'));
    }
    return user.getIdToken();
  };

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
    [activeTab.language, editorEs, editorEn, t],
  );

  const generateWithAI = async (language: 'es' | 'en', field: 'title' | 'excerpt' | 'content') => {
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

      const { content } = await response.json();

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

  const handleSave = async (publishNow = false) => {
    setSaving(true);
    setError(null);

    try {
      // Validation
      if (!formData.slug.trim()) {
        throw new Error(t('validation.slugRequired'));
      }
      if (!formData.es.title.trim() || !formData.en.title.trim()) {
        throw new Error(t('validation.titlesRequired'));
      }

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

      const result = await response.json();

      // Redirect to article list or stay in editor
      if (publishNow || mode === 'create') {
        router.push('/admin/articles');
      } else {
        // Update URL if slug changed
        if (result.slug !== articleSlug) {
          router.replace(`/admin/articles/${result.slug}`);
        }
      }
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
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-gray-600 text-white hover:bg-gray-700"
          >
            {saving ? <Spinner className="mr-2 h-4 w-4" /> : null}
            {t('saveDraft')}
          </Button>
          <Button
            onClick={() => handleSave(true)}
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
          {/* Language & Section Tabs */}
          <Card className="p-0">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {(['es', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab((prev) => ({ ...prev, language: lang }))}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab.language === lang
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {t(`languages.${lang}`)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="space-y-4 p-6">
              {/* Title */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('fields.title')}
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={formData[activeTab.language].title}
                    onChange={(e) => updateFormData(activeTab.language, 'title', e.target.value)}
                    placeholder={t('placeholders.title')}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => generateWithAI(activeTab.language, 'title')}
                    disabled={loading}
                    className="bg-purple-600 text-white hover:bg-purple-700"
                  >
                    {t('generateAI')}
                  </Button>
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('fields.content')}
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => generateWithAI(activeTab.language, 'content')}
                      disabled={loading}
                      className="bg-purple-600 text-xs text-white hover:bg-purple-700"
                    >
                      {t('generateAI')}
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          insertImageToEditor(file);
                        }
                      }}
                      className="hidden"
                      id="editor-image-upload"
                    />
                    <label
                      htmlFor="editor-image-upload"
                      className="cursor-pointer rounded bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-700"
                    >
                      {imageUploading ? <Spinner className="h-3 w-3" /> : t('addImage')}
                    </label>
                  </div>
                </div>

                {/* Editor Toolbar */}
                {currentEditor && (
                  <div className="rounded-t-md border border-gray-300 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-800">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => currentEditor.chain().focus().toggleBold().run()}
                        className={`p-1 text-xs ${currentEditor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                      >
                        B
                      </Button>
                      <Button
                        onClick={() => currentEditor.chain().focus().toggleItalic().run()}
                        className={`p-1 text-xs ${currentEditor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                      >
                        I
                      </Button>
                      <Button
                        onClick={() =>
                          currentEditor.chain().focus().toggleHeading({ level: 2 }).run()
                        }
                        className={`p-1 text-xs ${currentEditor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                      >
                        H2
                      </Button>
                      <Button
                        onClick={() => currentEditor.chain().focus().toggleBulletList().run()}
                        className={`p-1 text-xs ${currentEditor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                      >
                        UL
                      </Button>
                    </div>
                  </div>
                )}

                <div className="rounded-b-md border border-t-0 border-gray-300">
                  <EditorContent
                    editor={currentEditor}
                    className="prose prose-sm dark:prose-invert min-h-[400px] max-w-none p-4 focus:outline-none"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('fields.excerpt')}
                </label>
                <div className="flex space-x-2">
                  <textarea
                    value={formData[activeTab.language].excerpt}
                    onChange={(e) => updateFormData(activeTab.language, 'excerpt', e.target.value)}
                    placeholder={t('placeholders.excerpt')}
                    rows={3}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <Button
                    onClick={() => generateWithAI(activeTab.language, 'excerpt')}
                    disabled={loading}
                    className="bg-purple-600 text-white hover:bg-purple-700"
                  >
                    {t('generateAI')}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Article Settings */}
          <Card className="p-4">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              {t('settings.title')}
            </h3>

            <div className="space-y-4">
              {/* Slug */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('fields.slug')}
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder={t('placeholders.slug')}
                    className="flex-1"
                  />
                  <Button
                    onClick={generateSlugFromTitle}
                    className="bg-gray-600 text-xs text-white hover:bg-gray-700"
                  >
                    {t('generate')}
                  </Button>
                </div>
              </div>

              {/* Author */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('fields.author')}
                </label>
                <Input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => handleInputChange('authorName', e.target.value)}
                  placeholder={t('placeholders.author')}
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('fields.category')}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  title={t('fields.category')}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t('placeholders.category')}</option>
                  <option value="bitcoin">Bitcoin</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="altcoins">Altcoins</option>
                  <option value="defi">DeFi</option>
                  <option value="nft">NFT</option>
                  <option value="analysis">Análisis</option>
                  <option value="news">Noticias</option>
                  <option value="tutorials">Tutoriales</option>
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  id="featured"
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleBooleanChange('isFeatured', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {t('fields.featured')}
                </label>
              </div>
            </div>
          </Card>

          {/* Featured Image */}
          <Card className="p-4">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              {t('featuredImage.title')}
            </h3>

            {formData.imageUrl ? (
              <div className="space-y-3">
                <img src={formData.imageUrl} alt="Featured" className="w-full rounded-lg" />
                <Button
                  onClick={() => handleInputChange('imageUrl', '')}
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                >
                  {t('featuredImage.remove')}
                </Button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                  className="hidden"
                  id="featured-image-upload"
                />
                <label
                  htmlFor="featured-image-upload"
                  className="block w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
                >
                  {imageUploading ? (
                    <div className="flex items-center justify-center">
                      <Spinner className="mr-2 h-4 w-4" />
                      {t('featuredImage.uploading')}
                    </div>
                  ) : (
                    t('featuredImage.upload')
                  )}
                </label>
              </div>
            )}
          </Card>

          {/* Tags */}
          <Card className="p-4">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              {t('tags.title')}
            </h3>

            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder={t('tags.placeholder')}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1"
                />
                <Button onClick={handleAddTag} className="bg-blue-600 text-white hover:bg-blue-700">
                  {t('tags.add')}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ArticleEditor;
