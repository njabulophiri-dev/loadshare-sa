interface PageProps {
  params: Promise<{ id: string }>; // params is a Promise in the new versions
}

export default async function BusinessPage({ params }: PageProps) {
  // 1. Add 'async'
  // 2. 'Await' the params promise
  const { id } = await params;

  // For now, we'll just show the ID from the URL
  return (
    <main>
      <h1 className="text-3xl font-bold text-center mt-8">Business Details</h1>
      <p className="text-center">
        You are viewing business with ID: <strong>{id}</strong>{" "}
        {/* 3. Use the resolved 'id' */}
      </p>
      {/* We'll build the real details here later */}
    </main>
  );
}
