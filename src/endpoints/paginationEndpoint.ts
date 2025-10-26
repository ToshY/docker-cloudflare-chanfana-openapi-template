import { z } from "zod";
import { ChanfanaListEndpoint } from "../common/chanfanaListEndpoint";
import movieData from "../data/movies.json";

const movieModel = z.object({
	id: z.string(),
	title: z.string(),
	rating: z.number(),
	genres: z.array(z.string()),
});

const movieMeta = {
	model: {
		schema: movieModel,
		primaryKeys: ["id"],
	},
};

export class PaginationEndpoint extends ChanfanaListEndpoint {
	static openapiMeta = {
		tags: ["Movies"],
		summary: "Get paginated movie data",
		operationId: "movies",
	};

	_meta = movieMeta;

	async list(filters: any) {
		const page = filters.options.page;
		const perPage = filters.options.per_page;
		const totalCount = movieData.length;
		const start = (page - 1) * perPage;
		const end = start + perPage;
		const items = movieData.slice(start, end);

		return {
			result: items,
			result_info: {
				page: page,
				per_page: perPage,
				total_count: totalCount,
			},
		};
	}
}
