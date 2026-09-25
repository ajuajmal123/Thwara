export default function TeamPage() {
    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-8 items-center text-center">
                
                <h1 className="text-4xl md:text-5xl font-bold text-black border-2 border-[var(--color-brand-border)] px-6 py-3 rounded-full uppercase">
                    The <span className="text-[var(--color-brand-red)]">Core</span> Team
                </h1>
                
                <p className="max-w-2xl text-black font-medium my-4">
                    The individuals working behind the scenes to maintain our editorial standard and organize our community impact.
                </p>

                <div className="flex flex-wrap justify-center gap-8 w-full border-t-2 border-dotted border-[var(--color-brand-border)] pt-10">
                    {[{role: "Chief Editor", id: 1}, {role: "Creative Director", id: 2}, {role: "Lead Designer", id: 3}].map((member) => (
                        <div key={member.id} className="flex flex-col items-center w-full max-w-[300px] border-2 border-[var(--color-brand-border)] rounded p-6 bg-white relative">
                            <div className="absolute -top-3 -right-3 text-[var(--color-brand-red)] text-2xl">★</div>
                            <img src={`https://picsum.photos/seed/team${member.id}/250/250`} className="w-32 h-32 rounded object-cover border-2 border-[var(--color-brand-border)] mb-4" loading="lazy" />
                            <h2 className="text-xl font-bold text-black">Member Name {member.id}</h2>
                            <span className="text-sm font-bold text-[var(--color-brand-red)] uppercase my-1">{member.role}</span>
                            <div className="flex gap-2 mt-2">
                                <a href="#" className="w-6 h-6 border-[1px] border-[var(--color-brand-border)] text-black rounded flex items-center justify-center text-xs hover:text-[var(--color-brand-red)] hover:border-[var(--color-brand-red)]">X</a>
                                <a href="#" className="w-6 h-6 border-[1px] border-[var(--color-brand-border)] text-black rounded flex items-center justify-center text-xs hover:text-[var(--color-brand-red)] hover:border-[var(--color-brand-red)]">IN</a>
                            </div>
                        </div>
                    ))}
                </div>

            </section>
        </main>
    );
}