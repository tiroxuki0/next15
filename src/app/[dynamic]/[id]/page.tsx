export default function DynamicDetailPage({ params }: { params: { dynamic: string; id: string } }) {
  return (
    <div className='container py-10'>
      <h1 className='mb-6 text-3xl font-bold'>Dynamic Detail Page</h1>
      <p className='text-lg'>
        Category: <strong>{params.dynamic}</strong>
      </p>
      <p className='text-lg'>
        ID: <strong>{params.id}</strong>
      </p>
    </div>
  )
}
