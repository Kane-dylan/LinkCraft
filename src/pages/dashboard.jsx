import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UrlState } from '@/context';
import useFetch from '@/hooks/use-fetch';
import { getClicksForUrls } from '@/db/authClicks';
import Error from '@/components/error';
import { getUrls } from '@/db/apiUrls';


const Dashboard = () => {
  
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UrlState();
  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, user.id);
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    fnUrls();
  }, []);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);


  return (
    <div className='flex flex-col gap-4'>
      {(loading || loadingClicks) && <BarLoader width={"100%"} color="#36d7b7" />}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total click</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className='flex justify-between items-center'>
        <h1 className='text-4xl font-extrabold'>My Links</h1>
        <Button>Create Links</Button>
      </div>
      <div className='relative'>
        <Input type="text" placeholder='Filter links... ' value={searchQuery} onChange={(e)=>{
          setSearchQuery(e.target.value)
        }} />
      <Filter size={24} className='absolute top-2 right-2 p-1'/>
      </div>
      {error && <Error message={error?.message} />}
    </div>
  );
}

export default Dashboard