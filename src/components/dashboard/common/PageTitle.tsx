

export default function PageTitle({ children }: { children: string }) {
    return (
        <div className="text-base flex items-center gap-2 font-bold text-[#0087CA]">
            <span className="flex items-center gap-[3px]" aria-hidden="true">
                <span className="w-[7px] h-[7px] rounded-full bg-current" />
                <span className="w-[5px] h-[5px] rounded-full bg-current" />
                <span className="w-[3px] h-[3px] rounded-full bg-current" />
            </span>
            {children}
            <span className="flex items-center gap-[3px]" aria-hidden="true">
                <span className="w-[3px] h-[3px] rounded-full bg-current" />
                <span className="w-[5px] h-[5px] rounded-full bg-current" />
                <span className="w-[7px] h-[7px] rounded-full bg-current" />
            </span>
        </div>
    );
}