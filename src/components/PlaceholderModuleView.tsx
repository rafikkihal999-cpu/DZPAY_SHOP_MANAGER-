import React from 'react';
import {
  ChevronLeft,
  Plus,
  Store,
  Layers,
  Database,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { NavigationItem } from '../types';
import { ICON_MAP } from '../constants/navigation';

interface PlaceholderModuleViewProps {
  item: NavigationItem;
  onNavigateTo: (id: string) => void;
}

// Tailored specifications for each of the 20 non-dashboard modules in DZPAY SHOP MANAGER
const MODULE_SPECS: Record<
  string,
  {
    actionLabel: string;
    targetCollection: string;
    fieldHighlights: string[];
    emptyStateTitle: string;
    emptyStateDesc: string;
    tipText: string;
  }
> = {
  pos: {
    actionLabel: 'بدء عملية بيع جديدة',
    targetCollection: 'sales',
    fieldHighlights: ['قارئ الباركود', 'تحديد IMEI تلقائي', 'الدفع نقداً أو بريدي موب BaridiMob', 'طباعة تذكرة الضمان'],
    emptyStateTitle: 'نقطة البيع السريعة (POS) جاهزة للعمل',
    emptyStateDesc: 'واجهة مخصصة لكاشير محل الهواتف، تدعم البحث الفوري عن الإكسسوارات والهواتف بالباركود، وحساب الباقي بالدينار الجزائري.',
    tipText: 'الواجهة تدعم البيع بالتقسيط أو السداد الجزئي للزبائن المسجلين.',
  },
  sales: {
    actionLabel: 'تسجيل فاتورة جديدة',
    targetCollection: 'sales',
    fieldHighlights: ['رقم الفاتورة التسلسلي', 'اسم الزبون والهاتف', 'طريقة الدفع (كاش / بريدي موب)', 'حالة الضمان'],
    emptyStateTitle: 'سجل المبيعات والفواتير فارغ حالياً',
    emptyStateDesc: 'ستظهر هنا جميع فواتير البيع الصادرة مع إمكانية طباعة وصل حراري (Ticket de caisse) والتحقق من حالة المرتجعات.',
    tipText: 'كل عملية بيع تؤثر تلقائياً على مخزون الأجهزة والصندوق اليومي.',
  },
  products: {
    actionLabel: 'إضافة منتج أو إكسسوار',
    targetCollection: 'products',
    fieldHighlights: ['الباركود الدولي', 'سعر الشراء (DZD)', 'سعر البيع (DZD)', 'تنبيه انخفاض الكمية'],
    emptyStateTitle: 'دليل المنتجات والإكسسوارات',
    emptyStateDesc: 'لا توجد منتجات مسجلة في هذا القسم بعد. يمكنك إضافة كابلات الشحن، الشواحن الأصلية، كفرات الحماية، وسماعات البلوتوث.',
    tipText: 'الهواتف التي تحتوي على رقم IMEI يتم إدارتها بشكل منفصل في قسم الهواتف وأرقام IMEI.',
  },
  inventory: {
    actionLabel: 'بدء عملية جرد',
    targetCollection: 'inventory_movements',
    fieldHighlights: ['الكميات الحالية', 'حد الأمان للمخزون', 'قيمة المخزون الإجمالية (DZD)', 'حركات الإدخال والإخراج'],
    emptyStateTitle: 'إدارة المخزون وحركات الجرد',
    emptyStateDesc: 'المخزون فارغ حالياً. سيوفر هذا القسم مراقبة شاملة لكميات السلع، النواقص، وقيمة رأس المال المستثمر في البضاعة.',
    tipText: 'النظام يرسل تنبيهاً فور وصول أي منتج إلى الحد الأدنى المحدد.',
  },
  'phones-imei': {
    actionLabel: 'إدخال هاتف جديد مع IMEI',
    targetCollection: 'phones_imei',
    fieldHighlights: ['IMEI 1 و IMEI 2', 'الموديل وسعة التخزين', 'الحالة (جديد / مستعمل)', 'صحة البطارية وفترة الضمان'],
    emptyStateTitle: 'سجل الهواتف الذكية وأرقام IMEI',
    emptyStateDesc: 'لم يتم تسجيل أي هاتف بعد. يتيح لك هذا القسم تتبع كل هاتف بدقة تامة من لحظة شرائه من المورد حتى تسليمه للزبون مع شهادة الضمان.',
    tipText: 'الرقم التسلسلي IMEI إلزامي قانونياً وتجارياً لتفادي الهواتف المقلدة وتسهيل كفالة الزبائن.',
  },
  customers: {
    actionLabel: 'إضافة زبون جديد',
    targetCollection: 'customers',
    fieldHighlights: ['الاسم الكامل', 'رقم الهاتف (الجزائر)', 'الولاية ورقم بطاقة التعريف', 'سجل المشتريات والديون'],
    emptyStateTitle: 'دليل زبائن المحل',
    emptyStateDesc: 'لا توجد بيانات زبائن مسجلة حتى الآن. يمكنك تسجيل بيانات الزبائن الدائمين، تتبع مبيعاتهم، وتسهيل البيع بالتقسيط.',
    tipText: 'يمكن ربط مشتريات الزبون برقم هاتفه لإرسال إشعارات وتتبع كفالات الأجهزة.',
  },
  'installments-debts': {
    actionLabel: 'تسجيل دين أو قسط جديد',
    targetCollection: 'installments',
    fieldHighlights: ['المبلغ المتبقي (DZD)', 'تواريخ الاستحقاق', 'الدفعات المسددة', 'إشعار تذكير الزبون'],
    emptyStateTitle: 'إدارة الديون والأقساط (الكريدي)',
    emptyStateDesc: 'سجل الديون فارغ. يمكنك إدارة مبيعات التقسيط، جدولة الدفعات الشهرية، ومتابعة الديون المستحقة على الزبائن.',
    tipText: 'يساعدك هذا القسم في الحفاظ على سيولة المحل ومتابعة مواعيد السداد بدقة.',
  },
  suppliers: {
    actionLabel: 'إضافة مورد جديد',
    targetCollection: 'suppliers',
    fieldHighlights: ['اسم تاجر الجملة', 'الشركة / المستورد', 'الولاية ومقر النشاط', 'الرصيد المستحق للمورد'],
    emptyStateTitle: 'قائمة موردي الهواتف وقطع الغيار',
    emptyStateDesc: 'لا يوجد موردون مسجلون. قم بإضافة تجار الجملة وموردي الأجهزة والإكسسوارات لتتبع الفواتير والمدفوعات.',
    tipText: 'يمكن تسجيل حسابات الموردين المؤجلة ومتابعة دفعات الشيكات أو التحويلات.',
  },
  purchases: {
    actionLabel: 'تسجيل فاتورة شراء جديدة',
    targetCollection: 'purchases',
    fieldHighlights: ['رقم فاتورة المورد', 'إجمالي التكلفة (DZD)', 'الأجهزة والكميات المستلمة', 'حالة السداد'],
    emptyStateTitle: 'سجل مشتريات المحل وتوريد البضائع',
    emptyStateDesc: 'لم يتم تسجيل أي فاتورة توريد بعد. يتيح لك هذا القسم توثيق طلبيات الهواتف الجديدة وإضافتها مباشرة للمخزون.',
    tipText: 'إدخال فاتورة الشراء يقوم بتحديث سعر التكلفة والكميات تلقائياً.',
  },
  cashbox: {
    actionLabel: 'فتح جلسة صندوق جديدة',
    targetCollection: 'cashbox_sessions',
    fieldHighlights: ['الرصيد الافتتاحي (DZD)', 'المبيعات النقدية', 'مدفوعات بريدي موب BaridiMob', 'المصاريف المسحوبة'],
    emptyStateTitle: 'الصندوق والخزينة اليومية',
    emptyStateDesc: 'الصندوق مغلق حالياً بانتظار بدء الجلسة اليومية. يساعدك هذا القسم في مطابقة النقد الفعلي مع المبيعات اليومية وتجنب العجز.',
    tipText: 'يُنصح بفتح الجلسة في بداية دوام الكاشير وإغلاقها بعد جرد السيولة نهاية اليوم.',
  },
  expenses: {
    actionLabel: 'تسجيل مصروف جديد',
    targetCollection: 'expenses',
    fieldHighlights: ['نوع المصروف', 'المبلغ بالدينار (DZD)', 'تاريخ الخصم', 'اسم الشخص الذي قام بالصرف'],
    emptyStateTitle: 'سجل المصاريف اليومية والنثرية',
    emptyStateDesc: 'لا توجد مصاريف مسجلة. قم بتوثيق مصاريف الصيانة، المطبوعات، فواتير الشحن والنقل للمحل.',
    tipText: 'تُخصم المصاريف النثرية من أرباح المحل في التقارير المالية الدورية.',
  },
  'recurring-expenses': {
    actionLabel: 'إضافة مصروف دوري',
    targetCollection: 'recurring_expenses',
    fieldHighlights: ['إيجار المحل التجاري', 'اشتراك الإنترنت لاتصالات الجزائر', 'فاتورة سونلغاز الكهرباء', 'الخصم التلقائي المجدول'],
    emptyStateTitle: 'المصاريف الثابتة والدورية',
    emptyStateDesc: 'لا توجد التزامات دورية مسجلة. يمكنك جدولة فواتير الإيجار والإنترنت والكهرباء لتذكيرك بمواعيد الدفع.',
    tipText: 'يساعد ذلك في حساب التكلفة التشغيلية الحقيقية لكل شهر بدقة.',
  },
  employees: {
    actionLabel: 'إضافة موظف / بائع',
    targetCollection: 'employees',
    fieldHighlights: ['الاسم الكامل', 'المسمى الوظيفي (كاشير / فني صيانة)', 'رقم الهاتف وبطاقة التعريف', 'الراتب الأساسي المعتمد'],
    emptyStateTitle: 'إدارة فريق العمل والموظفين',
    emptyStateDesc: 'لا يوجد موظفون مسجلون. قم بإضافة البائعين، فنيي الصيانة، والمحاسبين لضبط الصلاحيات ومتابعة الحضور.',
    tipText: 'يمكن ربط كل موظف بحساب مستخدم للتحكم في العمليات المصرح له بها.',
  },
  payroll: {
    actionLabel: 'إعداد مسير الرواتب',
    targetCollection: 'payroll',
    fieldHighlights: ['الشهر المالي', 'الراتب الأساسي (DZD)', 'عمولات بيع الهواتف', 'صافي الراتب المستحق'],
    emptyStateTitle: 'سجل الرواتب والأجور الشهرية',
    emptyStateDesc: 'لم يتم إعداد كشوف رواتب لهذا الشهر. يتيح هذا القسم حساب رواتب الموظفين مع المكافآت والخصومات بدقة.',
    tipText: 'يمكن تحديد نسبة عمولة للبائعين على مبيعات الهواتف الذكية أو الإكسسوارات.',
  },
  'digital-services': {
    actionLabel: 'تسجيل عملية شحن (فليكسي)',
    targetCollection: 'digital_services',
    fieldHighlights: ['فليكسي موبيليس Mobilis', 'فليكسي جيزي Djezzy', 'فليكسي أوريدو Ooredoo', 'بطاقات جوجل بلاي وشحن الألعاب'],
    emptyStateTitle: 'الخدمات الرقمية وشحن الرصيد الجزائري',
    emptyStateDesc: 'سجل العمليات الرقمية فارغ. يدعم هذا القسم خدمات شحن الفليكسي السريع، بطاقات التعبئة، وتتبع هامش الربح والعمولات.',
    tipText: 'يمكنك تخصيص رصيد افتتاحي لشرائح الفليكسي ومراقبة الرصيد المتبقي لكل متعامل.',
  },
  reports: {
    actionLabel: 'إنشاء تقرير مفصل',
    targetCollection: 'reports',
    fieldHighlights: ['الأرباح الصافية (DZD)', 'الأجهزة الأكثر مبيعاً', 'أداء البائعين', 'مقارنة الفترات الزمنية'],
    emptyStateTitle: 'التقارير المالية والإحصائيات',
    emptyStateDesc: 'بانتظار تسجيل المبيعات وحركات المخزون لتوليد الرسوم البيانية وتقارير الأداء والأرباح الصافية للمحل.',
    tipText: 'ستتوفر الرسوم البيانية بدقة فور اتصال قاعدة البيانات وتسجيل العمليات الفعلية.',
  },
  notifications: {
    actionLabel: 'ضبط إعدادات التنبيهات',
    targetCollection: 'notifications',
    fieldHighlights: ['تنبيهات نقص المخزون', 'مواعيد الأقساط والديون', 'تسجيل الدخول المشبوه', 'تنبيهات الصندوق'],
    emptyStateTitle: 'مركز التنبيهات والإشعارات',
    emptyStateDesc: 'جميع التنبيهات في وضع الاستقرار. لا توجد إشعارات معلقة أو عاجلة في الوقت الراهن.',
    tipText: 'يمكنك تفعيل الإشعارات الفورية على مستوى المتصفح لضمان عدم تفويت أي استحقاق.',
  },
  'users-permissions': {
    actionLabel: 'إضافة مستخدم جديد',
    targetCollection: 'users',
    fieldHighlights: ['اسم المستخدم والبريد', 'الدور الوظيفي', 'صلاحية الخصم وتعديل الأسعار', 'صلاحية فتح الخزينة'],
    emptyStateTitle: 'المستخدمون والصلاحيات (RBAC)',
    emptyStateDesc: 'الحساب الرئيسي مفعل (Super Admin). يمكنك إضافة حسابات للكاشير ومديري الفروع مع تخصيص الصلاحيات بدقة.',
    tipText: 'الربط المباشر مع Firebase Authentication سيتيح إدارة كلمات المرور وتأمين الحسابات.',
  },
  'audit-logs': {
    actionLabel: 'تصفية سجل العمليات',
    targetCollection: 'audit_logs',
    fieldHighlights: ['توقيت العملية بدقة', 'اسم المستخدم المسؤول', 'نوع التعديل (إضافة / حذف / تعديل)', 'عنوان IP والجهاز'],
    emptyStateTitle: 'سجل التدقيق والعمليات (Audit Logs)',
    emptyStateDesc: 'سجل العمليات جاهز للتوثيق. سيتم تدوين كل تعديل على الأسعار، حذف فواتير، أو تعديل مخزون تلقائياً لحماية المحل.',
    tipText: 'سجل التدقيق محمي وغير قابل للتعديل للحفاظ على أمان المحل التجاري.',
  },
  settings: {
    actionLabel: 'حفظ الإعدادات',
    targetCollection: 'shop_settings',
    fieldHighlights: ['اسم المحل التجاري والسجل التجاري', 'أرقام الهاتف والولاية', 'طابعة الإيصالات الحرارية', 'بيانات بريدي موب BaridiMob'],
    emptyStateTitle: 'إعدادات المحل والنظام',
    emptyStateDesc: 'يمكنك هنا تخصيص بيانات الفاتورة المطبوعة، معلومات السجل التجاري، العملة الرسمية (DZD)، وخيارات النظام.',
    tipText: 'الإعدادات المحفوظة ستطبق على جميع نقاط البيع والأجهزة المتصلة بالمحل.',
  },
};

export const PlaceholderModuleView: React.FC<PlaceholderModuleViewProps> = ({
  item,
  onNavigateTo,
}) => {
  const IconComponent = ICON_MAP[item.icon] || Store;
  const spec = MODULE_SPECS[item.id] || {
    actionLabel: 'إجراء جديد',
    targetCollection: item.id.replace('-', '_'),
    fieldHighlights: ['البيانات الأساسية', 'تاريخ التسجيل', 'المستخدم المسؤول'],
    emptyStateTitle: item.title,
    emptyStateDesc: item.description,
    tipText: 'النظام مهيأ للتكامل المستقبلي مع Firebase Firestore.',
  };

  return (
    <div id={`module-view-${item.id}`} className="space-y-6">
      {/* Breadcrumbs & Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
            <button
              onClick={() => onNavigateTo('dashboard')}
              className="hover:text-emerald-700 transition-colors font-medium"
            >
              الرئيسية
            </button>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">{item.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 leading-none">
                  {item.title}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {item.titleEn}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {item.description}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            id={`btn-action-${item.id}`}
            onClick={() => {
              // Non-blocking interaction feedback
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs md:text-sm font-bold shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{spec.actionLabel}</span>
          </button>
        </div>
      </div>

      {/* Main Structural Empty State Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-100 shadow-xs">
            <IconComponent className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-black text-slate-900">
            {spec.emptyStateTitle}
          </h3>

          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            {spec.emptyStateDesc}
          </p>

          {/* Staged Data Fields for Firebase Architecture */}
          <div className="w-full mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>الميزات والمواصفات المهيأة لهذا القسم في نظام المحل:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              {spec.fieldHighlights.map((field, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{field}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Shop Tip */}
          <div className="w-full mt-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-900 text-right flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{spec.tipText}</span>
          </div>

          {/* Call to action */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTo('dashboard')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              العودة إلى لوحة التحكم
            </button>
            <button
              onClick={() => onNavigateTo('pos')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <span>الانتقال لنقطة البيع (POS)</span>
            </button>
          </div>
        </div>

        {/* Module Architecture Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-400" />
            <span>مسار التخزين في Firestore:</span>
            <code className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
              /{spec.targetCollection}
            </code>
          </div>
          <span className="font-medium text-emerald-700">
            جاهز للربط في الخطوة القادمة
          </span>
        </div>
      </div>
    </div>
  );
};
