function SeatLegend() {
  const legendItems = [
    { label: 'Disponible', color: 'bg-gray-400' },
    { label: 'Sélectionné', color: 'bg-green-500' },
    { label: 'Occupé', color: 'bg-gray-600' },
    { label: 'Premium', color: 'bg-accent' },
    { label: 'PMR', color: 'bg-blue-500' },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-6">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-t-lg ${item.color}`} />
          <span className="text-gray-300 text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default SeatLegend