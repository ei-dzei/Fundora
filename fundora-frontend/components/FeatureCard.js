export default function FeatureCard({ title, description }) {
  return (
    <div className="p-6 bg-[#1c514f]/60 backdrop-blur rounded-lg">
      <div className="text-4xl font-bold">•</div>
      <div className="mt-4 font-semibold text-lg">{title}</div>
      <div className="mt-2 text-gray-200 text-sm">{description}</div>
      <div className="mt-4 text-sm text-pvteal">Learn more.</div>
    </div>
  )
}
