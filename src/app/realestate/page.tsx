export default function RealEstatePage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🏡 عقارات وتسويق جازان</h1>

      <section className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">إضافة إعلان جديد</h2>
          <p className="text-gray-400">قريبًا ستتمكن من نشر عقارك مباشرة هنا ✨</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">عقارات مميزة</h2>
          <ul className="list-disc list-inside text-gray-300">
            <li>شقة فاخرة في صبيا - 3 غرف وصالة</li>
            <li>أرض تجارية على طريق الكورنيش بجازان</li>
            <li>مزرعة صغيرة في وادي جازان</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
