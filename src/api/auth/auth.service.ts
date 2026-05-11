import * as model from "./auth.model";
import { supabase } from "../../config/supabase.config";

/* -------------------------------------------------------------------------- */
/*                                   LOGIN                                    */
/* -------------------------------------------------------------------------- */

export async function loginUser(email: string, password: string) {
    const userResult = await model.getUser(email);

    const user = userResult.data;

    if (!user) {
        return {
            data: null,
            message: "Email atau password salah",
        };
    }

    if (user.password !== password) {
        return {
            data: null,
            message: "Email atau password salah",
        };
    }

    return {
        data: {
            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
        },
        message: "Login success",
    };
}

/* -------------------------------------------------------------------------- */
/*                             GET CURRENT USER                               */
/* -------------------------------------------------------------------------- */

export async function getCurrentUserById(user_id: string) {
    const result = await model.getCurrentUserById(user_id);

    if (!result.data) {
        return {
            data: null,
            message: "User tidak ditemukan",
        };
    }

    return {
        data: result.data,
    };
}

/* -------------------------------------------------------------------------- */
/*                                 REGISTER                                  */
/* -------------------------------------------------------------------------- */

export async function registerUser(body: any) {
    const {
        full_name,
        email,
        password,
        id_role,
        nomor_telepon,
        tanggal_lahir,
        id_provinsi,
        id_kabupaten,
        pekerjaan,
        institusi,
        ktp,
        bidang_keahlian,
        bio,
    } = body;

    // Check if email already exists
    const existingUser = await model.getUser(email);
    if (existingUser.data) {
        return {
            data: null,
            message: "Email sudah terdaftar",
        };
    }

    let ktpFileName = null;

    if (ktp) {
        try {
            // Generate unique filename
            const timestamp = Date.now();
            const fileExtension = ktp.name.split('.').pop() || 'png';
            ktpFileName = `${timestamp}_${email.split('@')[0]}.${fileExtension}`;
            const filePath = `KTP/${ktpFileName}`;

            // Upload to Supabase Storage
            const { error } = await supabase.storage
                .from('teman-belajar')
                .upload(filePath, ktp, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                console.error("Supabase upload error:", error);
                return {
                    data: null,
                    message: "Gagal mengupload KTP",
                };
            }
        } catch (error) {
            console.error("File upload error:", error);
            return {
                data: null,
                message: "Terjadi kesalahan saat mengupload KTP",
            };
        }
    }

    // Create user
    const result = await model.createUser({
        full_name,
        email,
        password,
        id_role: id_role || null,
        nomor_telepon: nomor_telepon || null,
        tanggal_lahir: tanggal_lahir || null,
        id_provinsi: id_provinsi || null,
        id_kabupaten: id_kabupaten || null,
        pekerjaan: pekerjaan || null,
        institusi: institusi || null,
        ktp: ktpFileName,
        bidang_keahlian: bidang_keahlian || null,
        bio: bio || null,
    });

    if (!result.data) {
        return {
            data: null,
            message: "Gagal membuat akun",
        };
    }

    return {
        data: {
            user_id: result.data.user_id,
            full_name: result.data.full_name,
            email: result.data.email,
        },
        message: "Register berhasil",
    };
}
