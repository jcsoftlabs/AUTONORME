'use client';

import { useState } from 'react';
import BookingModal from './BookingModal';

type Props = {
  garageId: string;
  garageName: string;
  bookBtnLabel: string;
};

export default function BookingButton({ garageId, garageName, bookBtnLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary"
        style={{ width: '100%' }}
      >
        {bookBtnLabel}
      </button>

      {open && (
        <BookingModal
          garageId={garageId}
          garageName={garageName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
