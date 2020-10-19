/* TODO: These are not yet comprehensive, final interfaces */

export interface DatasetMetadata {
  id: string;
  name: string;
  description: string;
  fields: Field[];
}

export interface Field {
  data_type: string;
  name: string;
  description: string;
  origin_dataset: string;
}

// TODO: make typedef for valid data types instead of any.
export type Row = Record<string, any>;

export class Dataset {
  readonly rows: Row[];
  readonly metadata: DatasetMetadata;

  constructor(rows: Row[], metadata: DatasetMetadata) {
    this.rows = rows;
    this.metadata = metadata;
  }

  getTableViewColumns() {
    return this.metadata.fields.map((field: Field) => ({
      Header: field.name,
      accessor: field.name,
    }));
  }
}

export type AllMetadata = Record<string, DatasetMetadata>;

export type LoadStatus = "unloaded" | "loading" | "loaded" | "error";

export interface DatasetStore {
  readonly loadDataset: (id: string) => void;
  readonly getDatasetLoadStatus: (id: string) => LoadStatus;
  readonly metadataLoadStatus: LoadStatus;
  readonly metadata: AllMetadata;
  readonly datasets: Record<string, Dataset>;
}
