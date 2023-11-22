"use client"
import React, { useState, ChangeEvent, useEffect } from 'react';
import addressData from '../../data/th-address.json';
import InputForm from './InputAddress';

interface SubDistrict {
    subDistrictId: string;
    districtId: string;
    provinceId: string;
    subDistrictName: string;
}

interface District {
    districtId: string;
    districtName: string;
    provinceId: string;
}

interface Province {
    provinceId: string;
    provinceName: string;
}

interface Address {
    zipCode: string;
    subDistrictList: SubDistrict[];
    provinceList: Province[];
    districtList: District[];
}

const getProvincesData = (data: Address[]): Province[] =>
    data.map((address: Address) => address.provinceList).flat();

const getDistrictsData = (data: Address[]): District[] =>
    data.map((address: Address) => address.districtList).flat();

const getCorrespondingZipCode = (data: Address[], subDistrictId: string): string | undefined =>
    data.find((item: Address) =>
        item.subDistrictList.some((subDistrict) => subDistrict.subDistrictId === subDistrictId)
    )?.zipCode;

const AutoComplete: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState<SubDistrict[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedData, setSelectedData] = useState<string>(''); // เพิ่ม state สำหรับเก็บ selectedData

    useEffect(() => {
        const provincesData = getProvincesData(addressData);
        const districtsData = getDistrictsData(addressData);

        setProvinces(provincesData);
        setDistricts(districtsData);
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        const filteredAddresses = addressData.find((address: Address) => address.zipCode === value);

        if (filteredAddresses) {
            setSuggestions(filteredAddresses.subDistrictList);
        } else {
            setSuggestions([]);
        }
    };

    const selectedProvinceList = (selectedData: string) => {
        setSelectedData(selectedData); 
    };

    return (
        <div >
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="กรอกรหัสไปรษณีย์ ..."
            />
            <ul>
                {suggestions.map((address: SubDistrict) => {
                    const correspondingZipCode = getCorrespondingZipCode(addressData, address.subDistrictId);
                    const selectedData = `ตำบล : ${address.subDistrictName}, อำเภอ : ${districts.find((dist) => dist.districtId === address.districtId)?.districtName || 'N/A'
                        }, จังหวัด : ${provinces.find((prov) => prov.provinceId === address.provinceId)?.provinceName || 'N/A'
                        }, รหัสไปรษณีย์: ${correspondingZipCode || 'N/A'}`;

                    return (
                        <li
                            key={address.subDistrictId}
                            onClick={() => selectedProvinceList(selectedData)}
                        >
                            {selectedData}
                        </li>
                    );

                })}
            </ul>


            <InputForm selectedData={selectedData} /> 
        </div>
    );
};

export default AutoComplete;
