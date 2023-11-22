"use client"
import React, { useState, ChangeEvent, useEffect } from 'react';
import addressData from '../../data/th-address.json'; // import ข้อมูลรหัสไปรษณีย์และข้อมูลที่เกี่ยวข้อง

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

const AutoComplete: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState<SubDistrict[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);

    useEffect(() => {
        // Fetch provinces and districts data from addressData or use your fetching mechanism
        const provincesData = addressData.map((address: Address) => address.provinceList).flat();
        const districtsData = addressData.map((address: Address) => address.districtList).flat();

        setProvinces(provincesData);
        setDistricts(districtsData);
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        // Filter suggestions based on zip code input value
        const filteredAddresses = addressData.find(
            (address: Address) => address.zipCode === value
        );

        // If address with matching zip code is found, set its subDistrictList as suggestions
        if (filteredAddresses) {
            setSuggestions(filteredAddresses.subDistrictList);
        } else {
            setSuggestions([]); // Clear suggestions if no matching zip code is found
        }
    };



    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="กรอกรหัสไปรษณีย์ . . ."
            />
            <ul>
                {suggestions.map((address: SubDistrict) => {
                    const correspondingZipCode = addressData.find((data: Address) =>
                        data.subDistrictList.some((subDistrict) => subDistrict.subDistrictId === address.subDistrictId)
                    )?.zipCode;

                    return (
                        <li key={address.subDistrictId}>
                            {`ตำบล : ${address.subDistrictName}, อำเภอ: ${districts.find((dist) => dist.districtId === address.districtId)?.districtName || 'N/A'
                                }, จังหวัด: ${provinces.find((prov) => prov.provinceId === address.provinceId)?.provinceName || 'N/A'
                                } , ไปรษณีย์: ${correspondingZipCode || 'N/A'},`}
                        </li>
                    );
                })}

            </ul>
        </div>
    );
};

export default AutoComplete;
