import {
    useQuery
} from "@tanstack/react-query";
import { me } from "../lib/api";

function useAuthUser() {
    const authUser = useQuery({
        queryKey: ["authUser"],
        queryFn: me,
        // if we want that tanstack don't really try 4 times again for the api calling;
        // we can use retry: false;
        retry: false, //auth check => if user is unauthorized for 1st time, then it means it will be same for n'th time also;
    });

    return { authUser: authUser.data?.user, isLoading: authUser.isLoading };
}

export default useAuthUser