import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function AppHeader() {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl text-primary">
                    Personal Finance Tracker
                </a>
            </div>
            <div className="flex-none">
                <button className="btn btn-square btn-ghost">
                    <Cog6ToothIcon />
                </button>
            </div>
        </div>
    );
}