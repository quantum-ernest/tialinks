// Data types for Map component
import type { GetProp, UploadProps } from "antd";

export type Coordinate = [number, number];

export interface Location {
  name: string;
  click_count: number;
  coordinates: Coordinate;
}

// Types for OTP
export type OTP = string[] | null;

// Types for Files
export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
