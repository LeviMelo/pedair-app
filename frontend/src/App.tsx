import React from 'react';
import PreAnestesia from './components/PreAnestesia';
import Intraoperatoria from './components/Intraoperatoria';
import RecuperacaoPosAnestesica from './components/RecuperacaoPosAnestesica';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8"> {/* Outer container */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          PedAir - Registro Perioperatório Pediátrico
        </h1>
        {/* Poderíamos adicionar um logo ou subtítulo aqui */}
      </header>

      <main className="max-w-4xl mx-auto"> {/* Main content area */}
        <PreAnestesia />
        <Intraoperatoria />
        <RecuperacaoPosAnestesica />

        <div className="mt-8 text-center">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors duration-150"
          >
            Salvar Registro (Simulado)
          </button>
        </div>
      </main>

      <footer className="mt-12 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} PedAir. Desenvolvido como projeto de aprendizado.</p>
      </footer>
    </div>
  );
}

export default App;