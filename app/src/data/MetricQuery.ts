import { Breakdowns } from "./Breakdowns";
import { JoinType } from "./datasetutils";
import { MetricId } from "./variableProviders";
import { Row } from "./DatasetTypes";

export class MetricQuery {
  readonly varIds: MetricId[];
  readonly breakdowns: Breakdowns;
  readonly joinType: JoinType;

  constructor(
    varIds: MetricId | MetricId[],
    breakdowns: Breakdowns,
    joinType?: JoinType
  ) {
    this.varIds = [varIds].flat();
    this.breakdowns = breakdowns;
    this.joinType = joinType || "left";
  }

  getUniqueKey(): string {
    return this.varIds.join(",") + ":____:" + this.breakdowns.getUniqueKey();
  }
}

export class UnsupportedBreakdownError extends Error {}
export class MissingDatasetError extends Error {}
export class NoDataError extends Error {}

export class MetricQueryResponse {
  readonly data: Row[];
  readonly error?:
    | NoDataError
    | MissingDatasetError
    | UnsupportedBreakdownError;

  constructor(
    input: Row[] | NoDataError | MissingDatasetError | UnsupportedBreakdownError
  ) {
    if (input instanceof Error) {
      this.error = input as Error;
      this.data = [];
    } else {
      this.data = input as Row[];
    }
  }

  isError() {
    return !!this.error;
  }
}
