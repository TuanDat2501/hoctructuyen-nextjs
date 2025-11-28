'use client';
import { useRouter } from 'next/navigation';
import './style.scss';

export default function DetailsCompnent() {
  const router = useRouter();
  const handleClick = (param:any) => {
    // Xử lý logic login ở đây...
    // Sau đó chuyển hướng:
    router.push(param);
  };
  return (
    <>
     <section className="course-section">
        DEtails
      </section>
    </>
  );
}