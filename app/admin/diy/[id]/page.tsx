
'use client';

import { useState, useEffect, use } from 'react';
import DiyForm from '@/components/admin/DiyForm';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditDiyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/admin/diy/${id}`)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="p-10 flex justify-center"><LoadingSpinner /></div>;
    if (!data) return <div className="p-10 text-center">Not Found</div>;

    return <DiyForm initialData={data} isEdit />;
}
