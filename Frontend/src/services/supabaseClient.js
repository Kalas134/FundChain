import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kauxitpgpizwqlkecpyo.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY || 'dummy-key-for-init'
);

function checkAnonKey() {
    if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('placeholder')) {
        throw new Error(
            "Supabase Anon Key가 설정되지 않았습니다.\n\n" +
            "Frontend/.env.local 파일에 VITE_SUPABASE_ANON_KEY=... 를 설정했는지 확인해 주세요.\n" +
            "(Supabase 대시보드 -> Project Settings -> API -> anon public key)"
        );
    }
}

/**
 * 프로필 이미지 업로드 (profile-image 버킷)
 * @param {File} file
 * @returns {Promise<{ path: string, publicUrl: string }>}
 */
export async function uploadProfileImage(file) {
    if (!file) throw new Error("업로드할 파일이 없습니다.");
    checkAnonKey();

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from('profile-image')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) {
        console.error('Profile image upload error:', error);
        if (error.message?.includes('row-level security') || error.message?.includes('RLS') || error.statusCode === '42501') {
            throw new Error(`Supabase Storage RLS (접근 권한) 오류:\n'profile-image' 버킷의 Public 업로드(INSERT) RLS 정책을 추가해 주세요.`);
        }
        throw new Error(error.message || '프로필 이미지 업로드 실패');
    }

    const { data: publicUrlData } = supabase.storage
        .from('profile-image')
        .getPublicUrl(filePath);

    return {
        path: filePath,
        publicUrl: publicUrlData.publicUrl
    };
}

/**
 * 프로필 이미지 삭제 (profile-image 버킷)
 * @param {string} filePath
 */
export async function deleteProfileImage(filePath) {
    if (!filePath || !SUPABASE_ANON_KEY) return;
    try {
        const { error } = await supabase.storage
            .from('profile-image')
            .remove([filePath]);
        if (error) {
            console.error('Profile image delete error:', error);
        }
    } catch (err) {
        console.error('Profile image delete error:', err);
    }
}

/**
 * 프로젝트 대표 이미지 업로드 (project-image 버킷)
 * @param {File} file
 * @returns {Promise<string>} publicUrl
 */
export async function uploadProjectImage(file) {
    if (!file) throw new Error("업로드할 파일이 없습니다.");
    checkAnonKey();

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from('project-image')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) {
        console.error('Project image upload error:', error);
        if (error.message?.includes('row-level security') || error.message?.includes('RLS') || error.statusCode === '42501') {
            throw new Error(`Supabase Storage RLS (접근 권한) 오류:\n'project-image' 버킷의 Public 업로드(INSERT) RLS 정책을 추가해 주세요.`);
        }
        throw new Error(error.message || '프로젝트 이미지 업로드 실패');
    }

    const { data: publicUrlData } = supabase.storage
        .from('project-image')
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
}
