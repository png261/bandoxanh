
'use client';

import { useState, useEffect } from 'react';
import DiyForm from '@/components/admin/DiyForm';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditDiyPage({ params }: { params: { id: string } }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/admin/diy/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [params.id]);

    if (loading) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;
    if (!data) return <div className="p-10 text-center">Not Found</div>;

    return <DiyForm initialData={data} isEdit />;
}
