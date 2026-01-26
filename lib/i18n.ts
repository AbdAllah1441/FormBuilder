export type Locale = "en" | "ar";

export const defaultLocale: Locale = "en";

export const translations = {
  en: {
    // Main page
    formBuilder: "Form Builder",
    createForms:
      "Create dynamic, beautiful forms with ease. Drag, drop, and customize to your heart's content.",
    addQuestion: "Add Question",
    formPreview: "Form Preview",
    publishShare: "Publish & Share",
    formTitle: "Form Title",
    enterFormTitle: "Enter form title",
    publishing: "Publishing...",
    publishShareBtn: "Publish & Share",
    shareLink: "Share Link:",
    copy: "Copy",
    copied: "Copied!",
    updateForm: "Update Form",
    updating: "Updating...",

    // Question types
    shortAnswer: "Short Answer",
    longAnswer: "Long Answer",
    multipleChoice: "Radio Buttons",
    checkboxes: "Checkboxes",
    rating: "Rating",

    // Question editor
    questionType: "Question Type",
    questionLabel: "Question Label",
    enterQuestionLabel: "Enter question label",
    required: "Required",
    options: "Options",
    addOption: "Add Option",
    deleteQuestion: "Delete Question",

    // Form preview
    noQuestionsPreview:
      "No questions to preview. Add questions in the builder!",
    noQuestionsYet: "No questions yet. Add a question to get started!",
    enterYourAnswer: "Enter your answer",

    // Public form
    submitForm: "Submit",
    submitting: "Submitting...",
    thankYou: "Thank You!",
    formSubmitted: "Your form has been submitted successfully.",
    fillRequiredFields: "Please fill in all required fields",

    // Admin dashboard
    adminDashboard: "Admin Dashboard",
    backToBuilder: "Back to Builder",
    totalResponses: "Total Responses",
    formCreated: "Form Created",
    questions: "Questions",
    formResponses: "Form Responses",
    viewResponses: "View all responses submitted to your form",
    noResponses: "No responses yet",
    shareFormLink: "Share your form link to start collecting responses",
    response: "Response",
    submitted: "Submitted",
    refresh: "Refresh",
    exportCSV: "Export CSV",
    errorLoadingResponses: "Error loading responses",

    // Not found
    notFound: "404",
    formNotFound: "Form Not Found",
    formNotFoundDesc:
      "The form you're looking for doesn't exist or has been removed.",
    goToFormBuilder: "Go to Form Builder",
  },
  ar: {
    // Main page
    formBuilder: "منشئ النماذج",
    createForms:
      "أنشئ نماذج جميلة وديناميكية بسهولة. اسحب وأفلت وخصص كما تشاء.",
    addQuestion: "إضافة سؤال",
    formPreview: "معاينة النموذج",
    publishShare: "نشر ومشاركة",
    formTitle: "عنوان النموذج",
    enterFormTitle: "أدخل عنوان النموذج",
    publishing: "جاري النشر...",
    publishShareBtn: "نشر ومشاركة",
    shareLink: "رابط المشاركة:",
    copy: "نسخ",
    copied: "تم النسخ!",
    updateForm: "تحديث النموذج",
    updating: "جاري التحديث...",

    // Question types
    shortAnswer: "إجابة قصيرة",
    longAnswer: "إجابة طويلة",
    multipleChoice: "إجابة واحدة من متعدد",
    checkboxes: "عدة إجابات من متعدد",
    rating: "تقييم",

    // Question editor
    questionType: "نوع السؤال",
    questionLabel: "نص السؤال",
    enterQuestionLabel: "أدخل نص السؤال",
    required: "مطلوب",
    options: "الخيارات",
    addOption: "إضافة خيار",
    deleteQuestion: "حذف السؤال",

    // Form preview
    noQuestionsPreview: "لا توجد أسئلة للمعاينة. أضف أسئلة في المنشئ!",
    noQuestionsYet: "لا توجد أسئلة بعد. أضف سؤالاً للبدء!",
    enterYourAnswer: "أدخل إجابتك",

    // Public form
    submitForm: "إرسال",
    submitting: "جاري الإرسال...",
    thankYou: "شكراً لك!",
    formSubmitted: "تم إرسال النموذج بنجاح.",
    fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة",

    // Admin dashboard
    adminDashboard: "لوحة التحكم",
    backToBuilder: "العودة إلى المنشئ",
    totalResponses: "إجمالي الردود",
    formCreated: "تاريخ الإنشاء",
    questions: "الأسئلة",
    formResponses: "ردود النموذج",
    viewResponses: "عرض جميع الردود المقدمة على نموذجك",
    noResponses: "لا توجد ردود بعد",
    shareFormLink: "شارك رابط النموذج لبدء جمع الردود",
    response: "رد",
    submitted: "تم الإرسال",
    refresh: "تحديث",
    exportCSV: "تصدير CSV",
    errorLoadingResponses: "خطأ في تحميل الردود",

    // Not found
    notFound: "404",
    formNotFound: "النموذج غير موجود",
    formNotFoundDesc: "النموذج الذي تبحث عنه غير موجود أو تم حذفه.",
    goToFormBuilder: "الذهاب إلى منشئ النماذج",
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}
