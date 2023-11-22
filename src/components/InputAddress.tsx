"use client"
import React, { useState } from 'react';

interface InputFormProps {
    selectedData: string;
}

const InputForm: React.FC<InputFormProps> = ({ selectedData }) => {

    console.log(selectedData , 'data');

    return (
        <div className='container mx-auto'>
            <p className='text-3xl text-red-800'>Selected Data: {selectedData}</p>
        </div>
    );
};

export default InputForm;
