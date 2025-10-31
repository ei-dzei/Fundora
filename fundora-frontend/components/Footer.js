export default function Footer() {
  return (
    <footer className="bg-[#071a1b] text-gray-300 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        <div>
          <div className="font-bold">Fundora</div>
          <div className="text-sm text-gray-400 mt-2">Onchain pension vaults</div>
        </div>

        <div className="text-sm text-gray-400">
          <div className="font-semibold">Services</div>
          <div>Lock & Save</div>
          <div>Borrow</div>
        </div>

        <div className="text-sm text-gray-400">
          <div className="font-semibold">About</div>
          <div>Contact us</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 text-sm text-gray-500">© {new Date().getFullYear()} Fundora | Privacy Policy • Terms of Service</div>
    </footer>
  )
}
