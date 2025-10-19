import Link from 'next/link';

// ... dein anderer Code ...

<div className="mb-4">
  <label className="flex items-start">
    <input type="checkbox" required className="mt-1 mr-2" />
    <span className="text-sm">
      Ich akzeptiere die{' '}
      <Link 
        href="/agb" 
        className="text-red-600 hover:underline" 
        target="_blank"
        rel="noopener noreferrer"
      >
        AGB
      </Link>{' '}
      und{' '}
      <Link 
        href="/datenschutz" 
        className="text-red-600 hover:underline" 
        target="_blank"
        rel="noopener noreferrer"
      >
        Datenschutzerklärung
      </Link>
    </span>
  </label>
</div>