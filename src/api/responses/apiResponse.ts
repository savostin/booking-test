const ApiResponse = (data?: object): object => {
    return {
        version: process.env.APP_VERSION as string,
        timestamp: (new Date()).toISOString(),
        data: data
    }
}

export { ApiResponse };