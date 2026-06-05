import { useSearchParams } from 'react-router-dom';
import { useClassrooms } from '../hooks/useClassrooms';
import ReserveForm from '../components/ReserveForm';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Reserve() {
  const [searchParams] = useSearchParams();
  const preselectedRoom = searchParams.get('room') || '';
  const { classrooms, loading } = useClassrooms();

  if (loading) return <LoadingSpinner text="Loading classrooms..." />;

  return (
    <div className="flex justify-center fade-in">
      <ReserveForm classrooms={classrooms} preselectedRoom={preselectedRoom} />
    </div>
  );
}
