"use client"
import React, { useState, ChangeEvent, useEffect } from 'react';
import addressData from '../../data/th-address.json';

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

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="กรอกรหัสไปรษณีย์ ..."
            />
            <ul>
                {suggestions.map((address: SubDistrict) => {
                    const correspondingZipCode = getCorrespondingZipCode(addressData, address.subDistrictId);

                    return (
                        <li key={address.subDistrictId}>
                            {`ตำบล : ${address.subDistrictName}, อำเภอ : ${districts.find((dist) => dist.districtId === address.districtId)?.districtName || 'N/A'
                                }, จังหวัด : ${provinces.find((prov) => prov.provinceId === address.provinceId)?.provinceName || 'N/A'
                                }, รหัสไปรษณีย์: ${correspondingZipCode || 'N/A'}`}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AutoComplete;
