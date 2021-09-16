import vegbilderOGC from './vegbilderOGC';

export const getAvailableStatisticsFromOGC = async () => {
    const typename = `vegbilder_1_0:Vegbilder_statistikk`;

    return await vegbilderOGC
        .get('', {
            params: {
                service: 'WFS',
                version: '2.0.0',
                request: 'GetFeature',
                typenames: typename,
                typename: typename,
                outputformat: 'application/json'
            }
        })
        .catch((error) => {
            return error;
        })
}