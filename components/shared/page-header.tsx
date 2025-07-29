import React from 'react'

export default function PageHeader({
    title,
    description
}: { title: string, description: string }) {
    return (
        <div className='space-y-2'>
            <h1 className='scroll-m-20 text-3xl font-bold tracking-tight'>{title}</h1>
            <p className='text-base text-muted-foreground'>
                {description}
            </p>
        </div>
    )
}
