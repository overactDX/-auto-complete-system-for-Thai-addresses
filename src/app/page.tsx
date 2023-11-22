import React from 'react';
import AddressAutoComplete from '../components/AddressAutoComplete';
import InputForm from '@/components/InputAddress';

const Home = () => {
  return (
    <div className='container mx-auto mt-20'>
      <h1>Thai Address Auto-Complete</h1>
      <AddressAutoComplete />
    </div>
  );
};

export default Home;
