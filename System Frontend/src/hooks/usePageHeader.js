import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

// Lets any page inside DashboardLayout set the topbar's title/subtitle:
//   usePageHeader({ title: 'Accounts', subtitle: 'Everything you hold with us' });
export const usePageHeader = ({ title, subtitle }) => {
  const { setHeader } = useOutletContext();

  useEffect(() => {
    setHeader({ title, subtitle });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, subtitle]);
};
