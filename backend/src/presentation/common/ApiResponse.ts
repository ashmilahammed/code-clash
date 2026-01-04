export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;

  private constructor(
    success: boolean,
    message: string,
    data?: T | undefined,
    error?: string | undefined
  ) {
    this.success = success;
    this.message = message;

    if (data !== undefined) {
      this.data = data;
    }

    if (error !== undefined) {
      this.error = error;
    }
  }

  static success<T>(message: string, data?: T) {
    return new ApiResponse<T>(true, message, data);
  }

  static error(message: string, error?: string) {
    return new ApiResponse<null>(false, message, undefined, error);
  }
}
