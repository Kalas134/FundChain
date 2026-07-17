import React, { useState } from 'react';
import Card from './Card';
import profileImg from '../../assets/profile.png';

function Mypage(props) {
    const [userInfo, setUserInfo] = useState({
        imageUrl: profileImg,
        nickname: "동구리",
        name: "이동구",
        birth: "2001.04.01",
        email: "cucu0401@naver.com",
        phone: "010-4444-4444",
    });

    const handleUpdate = (updatedInfo) => {
        setUserInfo(updatedInfo);
    };

    return (
        <div className='px-16'>
            <Card
                userInfo={userInfo}
                onUpdate={handleUpdate}
            />
        </div>
    );
}

export default Mypage;