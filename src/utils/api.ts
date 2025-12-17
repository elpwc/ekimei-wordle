export const API_PREFIX = '/ekiwordle';
const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const request = (input: string | URL | Request, init?: RequestInit | undefined) => {
	return fetch(API_PREFIX + input, init);
};

export enum OrderType {
	none = '',
	date = 'date',
	challenge = 'challenge',
	complete = 'complete',
	createDate = 'createDate',
}

export const getQuestionsList = async ({
	stationId = -1,
	challenge = -1,
	complete = -1,
	maskedStationName = '',
	showAt,
	orderBy = OrderType.createDate,
	limit = 20,
	asc = false,
	page = 0,
}: {
	stationId?: number;
	challenge?: number;
	complete?: number;
	maskedStationName?: string;
	showAt?: Date;
	orderBy?: OrderType;
	limit?: number;
	asc?: boolean;
	page?: number;
} = {}) => {
	const params = new URLSearchParams();
	//console.log(companyId, from, to, search);
	if (stationId >= 0) params.append('stationId', String(stationId));
	if (challenge >= 0) params.append('challenge', String(challenge));
	if (complete >= 0) params.append('complete', String(complete));
	if (showAt) params.append('showAt', showAt.toISOString());
	if (orderBy !== OrderType.none) params.append('orderBy', orderBy);
	if (maskedStationName !== '') params.append('maskedStationName', maskedStationName);
	if (limit >= 0) params.append('limit', String(limit));
	if (asc) params.append('asc', asc ? 'asc' : 'desc');
	if (page) params.append('page', page.toString());

	//console.log(params);
	return await request('/api/question' + (params.toString() ? `?${params.toString()}` : ''))
		.then((response) => response.json())
		.then((data) => {
			//console.log(data);
			return data;
		})
		.catch((e) => {
			console.error(e);
		});
};

export const getQuestionByDate = async (id: number) => {
	try {
		const response = await request('/api/ticket?ticketId=' + id);
		const data = await response.json();

		//console.log(data);

		return data ?? null;
	} catch (e) {
		console.error('getUploadedTicketById error:', e);
		return null;
	}
};

export const updateQuestionCompleteInfo = async (id: number) => {
	return await request(`/api/ticket/${id}/like`, {
		method: 'POST',
	});
};
