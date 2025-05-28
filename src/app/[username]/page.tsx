import ServicesSchedulingForm from '@/modules/scheduling/services/ServicesSchedulingForm';
import {
  getHostUserByUsername,
  getUserByUsernameHandler
} from '~/trpc/server/handlers/user.handler';

const SchedulingPage = async (props: {params: Promise<{username: string}>}) => {
  const params = await props.params;
  // 5 second timer

  let host = null;
  try {
    host = await getHostUserByUsername(params.username);
    if (!host) {
      throw new Error('Host not found');
    }
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw new Error('Host not found');
    // Handle the error as needed, e.g., show an error message or redirect
  }

  return <ServicesSchedulingForm host={host} />;
};

export default SchedulingPage;
