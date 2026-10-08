import { useState } from "react";

export default function App() {
  const [carDoor, setCarDoor] = useState(null);
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [revealedDoor, setRevealedDoor] = useState(null);
  const [phase, setPhase] = useState("start");
  const [result, setResult] = useState(null);

  const [stats, setStats] = useState({
    totalGames: 0,
    stayWins: 0,
    switchWins: 0,
  });

  // Start a new game
  const startGame = () => {
    const randomDoor = Math.floor(Math.random() * 3) + 1;

    setCarDoor(randomDoor);
    setSelectedDoor(null);
    setRevealedDoor(null);
    setResult(null);
    setPhase("choose");
  };

  // Player selects a door
  const chooseDoor = (door) => {
    if (phase !== "choose") return;

    setSelectedDoor(door);

    // Monty must reveal a goat
    const goatDoors = [1, 2, 3].filter((d) => d !== door && d !== carDoor);

    const montyDoor = goatDoors[Math.floor(Math.random() * goatDoors.length)];

    setRevealedDoor(montyDoor);
    setPhase("decision");
  };

  // Player chooses stay or switch
  const makeDecision = (strategy) => {
    if (phase !== "decision") return;

    let finalDoor = selectedDoor;

    if (strategy === "switch") {
      finalDoor = [1, 2, 3].find(
        (door) => door !== selectedDoor && door !== revealedDoor,
      );
    }

    const won = finalDoor === carDoor;

    setResult({
      strategy,
      finalDoor,
      won,
    });

    setStats((prev) => ({
      totalGames: prev.totalGames + 1,
      stayWins: prev.stayWins + (strategy === "stay" && won ? 1 : 0),
      switchWins: prev.switchWins + (strategy === "switch" && won ? 1 : 0),
    }));

    setPhase("result");
  };

  // Reset statistics
  const resetStats = () => {
    setStats({
      totalGames: 0,
      stayWins: 0,
      switchWins: 0,
    });
  };

  const stayRate =
    stats.totalGames > 0
      ? Math.round((stats.stayWins / stats.totalGames) * 100)
      : 0;

  const switchRate =
    stats.totalGames > 0
      ? Math.round((stats.switchWins / stats.totalGames) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#F5F9FD] text-[#09294A]">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-[#09294A] text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#game" className="text-lg font-bold sm:text-xl">
            Monty Hall <span className="text-[#F28C28]">Problem</span>
          </a>

          <nav className="hidden gap-8 md:flex">
            <a href="#game" className="transition hover:text-[#F28C28]">
              Game
            </a>

            <a href="#how-it-works" className="transition hover:text-[#F28C28]">
              How It Works
            </a>

            <a href="#statistics" className="transition hover:text-[#F28C28]">
              Statistics
            </a>
          </nav>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main>
        {/* ================= GAME ================= */}
        <section
          id="game"
          className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        >
          {/* Title */}
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Probability Game
            </p>

            <h1 className="text-3xl font-black sm:text-4xl lg:text-5xl">
              The Monty Hall Problem
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Choose a door, let Monty reveal a goat, then decide whether you
              should stay or switch.
            </p>
          </div>

          {/* Game Card */}
          <div className="rounded-3xl border border-[#DCE8F5] bg-white p-5 shadow-sm sm:p-8">
            {/* START */}
            {phase === "start" && (
              <div className="py-10 text-center">
                <div className="text-6xl">🚪</div>

                <h2 className="mt-5 text-2xl font-bold">Ready to play?</h2>

                <p className="mx-auto mt-3 max-w-lg text-slate-500">
                  There are three doors. Behind one door is a car, while the
                  other two contain goats.
                </p>

                <button
                  onClick={startGame}
                  className="mt-7 rounded-xl bg-[#F28C28] px-8 py-3 font-bold text-white transition hover:bg-[#dc7817]"
                >
                  Start Game
                </button>
              </div>
            )}

            {/* CHOOSE DOOR */}
            {phase === "choose" && (
              <>
                <div className="mb-8 text-center">
                  <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                    Step 1
                  </span>

                  <h2 className="mt-4 text-2xl font-bold">Choose a Door</h2>

                  <p className="mt-2 text-slate-500">
                    Which door do you think has the car?
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  {[1, 2, 3].map((door) => (
                    <button
                      key={door}
                      onClick={() => chooseDoor(door)}
                      className="group h-64 rounded-2xl border-4 border-[#09294A] bg-[#09294A] transition duration-300 hover:-translate-y-2 hover:border-[#F28C28] hover:shadow-xl sm:h-72"
                    >
                      <div className="flex h-full flex-col items-center justify-center">
                        <span className="text-6xl font-black text-white">
                          {door}
                        </span>

                        <span className="mt-3 text-sm font-semibold text-white/60">
                          DOOR
                        </span>

                        <span className="mt-6 rounded-full bg-white/10 px-4 py-2 text-xs text-white opacity-0 transition group-hover:opacity-100">
                          Choose
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* DECISION */}
            {phase === "decision" && (
              <>
                <div className="mb-8 text-center">
                  <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                    Step 2
                  </span>

                  <h2 className="mt-4 text-2xl font-bold">
                    Monty Revealed a Goat!
                  </h2>

                  <p className="mt-2 text-slate-500">
                    You selected Door {selectedDoor}. What do you want to do?
                  </p>
                </div>

                {/* Doors */}
                <div className="grid gap-5 sm:grid-cols-3">
                  {[1, 2, 3].map((door) => {
                    const isRevealed = door === revealedDoor;

                    const isSelected = door === selectedDoor;

                    return (
                      <div
                        key={door}
                        className={`h-64 rounded-2xl border-4 sm:h-72 ${
                          isRevealed
                            ? "border-slate-300 bg-slate-100"
                            : isSelected
                              ? "border-[#F28C28] bg-[#09294A]"
                              : "border-[#09294A] bg-[#09294A]"
                        }`}
                      >
                        <div className="flex h-full flex-col items-center justify-center">
                          {isRevealed ? (
                            <>
                              <span className="text-6xl">🐐</span>

                              <span className="mt-3 font-bold text-slate-600">
                                GOAT
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-5xl font-black text-white">
                                {door}
                              </span>

                              {isSelected && (
                                <span className="mt-4 rounded-full bg-[#F28C28] px-4 py-2 text-xs font-bold text-white">
                                  YOUR CHOICE
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Decision Buttons */}
                <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => makeDecision("stay")}
                    className="rounded-2xl border-2 border-[#09294A] bg-white p-5 text-left transition hover:bg-[#09294A] hover:text-white"
                  >
                    <p className="text-lg font-bold">Stay</p>

                    <p className="mt-1 text-sm opacity-70">
                      Keep Door {selectedDoor}
                    </p>
                  </button>

                  <button
                    onClick={() => makeDecision("switch")}
                    className="rounded-2xl bg-[#F28C28] p-5 text-left text-white transition hover:bg-[#dc7817]"
                  >
                    <p className="text-lg font-bold">Switch</p>

                    <p className="mt-1 text-sm text-white/80">
                      Choose the remaining door
                    </p>
                  </button>
                </div>
              </>
            )}

            {/* RESULT */}
            {phase === "result" && (
              <>
                <div className="mb-8 text-center">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      result.won
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {result.won ? "You Won!" : "You Lost!"}
                  </span>

                  <h2 className="mt-5 text-3xl font-black">
                    {result.won
                      ? "Congratulations! 🎉"
                      : "Better Luck Next Time!"}
                  </h2>

                  <p className="mt-2 text-slate-500">
                    You decided to {result.strategy}.
                  </p>
                </div>

                {/* Final Doors */}
                <div className="grid gap-5 sm:grid-cols-3">
                  {[1, 2, 3].map((door) => {
                    const isCar = door === carDoor;

                    return (
                      <div
                        key={door}
                        className={`h-64 rounded-2xl border-4 sm:h-72 ${
                          isCar
                            ? "border-green-500 bg-green-50"
                            : "border-slate-300 bg-slate-100"
                        }`}
                      >
                        <div className="flex h-full flex-col items-center justify-center">
                          {isCar ? (
                            <>
                              <span className="text-6xl">🚗</span>

                              <span className="mt-3 text-xl font-bold text-green-700">
                                CAR!
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-6xl">🐐</span>

                              <span className="mt-3 font-bold text-slate-500">
                                GOAT
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Result Information */}
                <div className="mt-8 rounded-2xl bg-[#F5F9FD] p-6 text-center">
                  <p className="text-sm text-slate-500">The car was behind</p>

                  <p className="mt-1 text-3xl font-black">Door {carDoor}</p>

                  <button
                    onClick={startGame}
                    className="mt-5 rounded-xl bg-[#09294A] px-8 py-3 font-bold text-white transition hover:bg-[#123d67]"
                  >
                    Play Again
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section
          id="how-it-works"
          className="bg-white px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-[#F28C28]">
                Explanation
              </p>

              <h2 className="mt-2 text-3xl font-black">How It Works</h2>

              <p className="mx-auto mt-3 max-w-2xl text-slate-500">
                The surprising part of the Monty Hall Problem is that switching
                actually doubles your chance of winning.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl bg-[#F5F9FD] p-6">
                <div className="text-3xl font-black text-[#1264D8]">1/3</div>

                <h3 className="mt-3 font-bold">Initial Choice</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Your first door has only a one-in-three chance of containing
                  the car.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F5F9FD] p-6">
                <div className="text-3xl font-black text-[#1264D8]">1</div>

                <h3 className="mt-3 font-bold">Monty Reveals a Goat</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Monty knows where the car is and always reveals a goat behind
                  another door.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F5F9FD] p-6">
                <div className="text-3xl font-black text-[#F28C28]">2/3</div>

                <h3 className="mt-3 font-bold">Switching</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The remaining unopened door has a two-in-three chance of
                  containing the car.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATISTICS ================= */}
        <section id="statistics" className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-[#F28C28]">
                  Your Results
                </p>

                <h2 className="mt-1 text-3xl font-black">Statistics</h2>
              </div>

              <button
                onClick={resetStats}
                className="rounded-xl border border-[#DCE8F5] bg-white px-5 py-2.5 text-sm font-bold transition hover:bg-slate-50"
              >
                Reset Statistics
              </button>
            </div>

            {/* Total */}
            <div className="mb-5 rounded-2xl border border-[#DCE8F5] bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Games</p>

              <p className="mt-2 text-4xl font-black">{stats.totalGames}</p>
            </div>

            {/* Stay / Switch */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Stay */}
              <div className="rounded-2xl border border-[#DCE8F5] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Stay</h3>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    Theory: 33.3%
                  </span>
                </div>

                <p className="mt-5 text-4xl font-black text-[#1264D8]">
                  {stats.stayWins}
                </p>

                <p className="text-sm text-slate-500">wins</p>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#1264D8] transition-all"
                    style={{
                      width: `${stayRate}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Win rate: <strong>{stayRate}%</strong>
                </p>
              </div>

              {/* Switch */}
              <div className="rounded-2xl border border-[#DCE8F5] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Switch</h3>

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                    Theory: 66.7%
                  </span>
                </div>

                <p className="mt-5 text-4xl font-black text-[#F28C28]">
                  {stats.switchWins}
                </p>

                <p className="text-sm text-slate-500">wins</p>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#F28C28] transition-all"
                    style={{
                      width: `${switchRate}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Win rate: <strong>{switchRate}%</strong>
                </p>
              </div>
            </div>

            {/* Theory Card */}
            <div className="mt-5 rounded-2xl bg-[#09294A] p-6 text-white">
              <h3 className="text-lg font-bold">The Mathematical Advantage</h3>

              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-white/60">Stay</p>

                  <p className="mt-1 text-3xl font-black">33.3%</p>
                </div>

                <div>
                  <p className="text-sm text-white/60">Switch</p>

                  <p className="mt-1 text-3xl font-black text-[#F28C28]">
                    66.7%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#09294A] px-4 py-6 text-center text-sm text-white/60">
        &copy; {new Date().getFullYear()} Monty Hall Problem. All rights
        reserved.
      </footer>
    </div>
  );
}
