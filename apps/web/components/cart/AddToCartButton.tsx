'use client';

import { useCartStore, CartItem } from '../../lib/store/useCartStore';
import { useState } from 'react';

type Props = {
  item: CartItem;
  disabled?: boolean;
  label: string;
};

export default function AddToCartButton({ item, disabled, label }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addItem({ ...item, quantity: 1 });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={disabled}
      className="btn btn-primary"
      style={{
        width: '100%',
        justifyContent: 'center',
        background: isAdded ? 'var(--color-accent-green)' : 'var(--color-primary-600)',
        borderColor: isAdded ? 'var(--color-accent-green)' : 'var(--color-primary-600)',
        transition: 'all 0.3s ease',
      }}
    >
      {isAdded ? '✓ Ajouté au panier' : label}
    </button>
  );
}
