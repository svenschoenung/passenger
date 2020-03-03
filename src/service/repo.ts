import { ValidationResult, validateFolder } from '@/model/validation';

export async function validateRepository(gpgPath: string): Promise<ValidationResult> {
    return await validateFolder(gpgPath)
}