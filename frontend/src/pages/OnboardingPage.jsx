import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboarding } from "../lib/api";
import toast from "react-hot-toast";
import { CameraIcon, Heart, Loader2Icon, MapPinIcon, Shuffle } from "lucide-react";

function OnboardingPage() {
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();

    const [formState, setFormState] = useState({
        fullName: authUser?.fullName || "",
        bio: authUser?.bio || "",
        location: authUser?.location || "",
        profilePic: authUser?.profilePic || "",
    });

    const { mutate: onboardingMutation, isPending } = useMutation({
        mutationFn: onboarding,
        onSuccess: () => {
            toast.success("Profile onboarded successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message)
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        onboardingMutation(formState);
    };

    const handleRandomAvatar = () => {
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        setFormState({ ...formState, profilePic: randomAvatar });
        toast.success("Random profile pic generated! :)")
    }

    return (
        <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="black">
            <div className="border border-primary/35 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                <div className="card bg-base-200 w-full shadow-xl">
                    <div className="card-body p-6 sm:p-8">
                        <h1 className="text-2xl text-primary font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider sm:text-3xl font-bold text-center mb-6">
                            Complete your Profile
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* profile pic generator */}
                            <div className="flex flex-col items-center justify-center space-y-4">
                                {/* image preview */}
                                <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                                    {formState.profilePic ? (
                                        <img
                                            src={formState.profilePic}
                                            alt="profile preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <CameraIcon className="size-12 text-base-content opacity-40" />
                                        </div>
                                    )}
                                </div>

                                {/* generate random avator button */}
                                <div className="flex items-center gap-2">
                                    <button
                                        className="btn btn-primary font-extrabold w-full rounded-full bg-primary/75"
                                        type="button"
                                        onClick={handleRandomAvatar}
                                    >
                                        <Shuffle className="size-4 mr-2" />
                                        Generate Random Avatar
                                    </button>
                                </div>

                                {/* full name */}
                                <div className="w-3/5 form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Full Name
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formState.fullName}
                                        onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                                        className="input input-bordered w-full rounded-full"
                                        placeholder="Your Full Name"
                                    />
                                </div>

                                {/* bio */}
                                <div className="w-3/5 form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Bio
                                        </span>
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formState.bio}
                                        onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                                        className="textearea p-4 h-24 min-h-20 bg-black w-full textarea-bordered rounded-3xl"
                                        placeholder="Write something about yourself"
                                    />
                                </div>

                                {/* location */}
                                <div className="w-3/5 form-control">
                                    <label
                                        className="label">
                                        Location
                                    </label>

                                    <div className="relative">
                                        <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formState.location}
                                            placeholder="City, Country"
                                            className="input input-bordered w-full rounded-full pl-10"
                                            onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                                        />

                                    </div>
                                </div>

                                {/* submit button */}
                                <button
                                    className="btn btn-primary font-extrabold w-3/5 rounded-full bg-primary/75"
                                    disabled={isPending}
                                    type="submit">

                                    {!isPending ? (
                                        <>
                                            <Heart className="size-5 mr-2" />
                                            Complete Onboarding
                                        </>
                                    ) : (
                                        <>
                                            <Loader2Icon className="animate-spin size-5 mr-2" />
                                            Onboarding...
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OnboardingPage