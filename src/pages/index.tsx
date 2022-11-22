import { trpc } from '~/client/utils/trpc';

export default function Home() {
  const { data, isLoading, isFetching, error, isError } = 
    trpc.getHello.useQuery();

  if (isLoading || isFetching) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <section className="bg-ct-blue-600 min-h-screen pt-20">
      <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
        <p className="text-3xl font-semibold">{data?.message}</p>
      </div>
    </section>
  )
}
