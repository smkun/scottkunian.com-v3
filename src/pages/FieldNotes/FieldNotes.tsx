export function FieldNotes() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-secondary-900 mb-8">Field Notes</h1>
      <p className="text-lg text-secondary-600 mb-8">Short takes. Things I'm testing.</p>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">Notes coming soon</h3>
          <p className="text-secondary-600">Field notes will be loaded from Firebase.</p>
        </div>
      </div>
    </div>
  );
}