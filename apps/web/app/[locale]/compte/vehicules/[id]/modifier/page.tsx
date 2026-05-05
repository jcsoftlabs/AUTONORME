'use client';

import { useParams } from 'next/navigation';
import VehicleForm from '../../../../../../components/account/VehicleForm';

export default function EditVehiclePage() {
  const params = useParams<{ id: string }>();

  return <VehicleForm mode="edit" vehicleId={params.id} />;
}
