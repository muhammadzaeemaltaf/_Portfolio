import { IconType } from "react-icons";

export type EducationDataType = ReadonlyArray<{
    readonly title: string;
    readonly institution: string;
    readonly fields: ReadonlyArray<string>;
    readonly icon: IconType;
    readonly date: string;
    readonly type: string;
    readonly description?: string;
  }>
