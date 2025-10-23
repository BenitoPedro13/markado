'use client';

export default function BookingListSkeleton() {
  return (
    <>
      {/* Barra de controle superior */}
      <div className="w-full gap-8 p-8">
        <div className="flex justify-between">
          {/* Filtros (Tabs) */}
          <div className="flex items-center gap-1 bg-bg-weak-50 rounded-lg p-1">
            <div className="bg-bg-white-0 rounded-md px-4 py-2 w-20 h-9 animate-pulse" />
            <div className="bg-bg-weak-50 rounded-md px-4 py-2 w-24 h-9 animate-pulse" />
            <div className="bg-bg-weak-50 rounded-md px-4 py-2 w-24 h-9 animate-pulse" />
          </div>
          
          {/* Controles da direita */}
          <div className="flex items-center justify-end gap-2">
            {/* Barra de pesquisa */}
            <div className="w-full min-w-[250px]">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-bg-soft-200 rounded animate-pulse" />
                <div className="w-full h-10 bg-bg-soft-200 rounded-lg animate-pulse pl-10" />
              </div>
            </div>
            
            {/* Botão de ordenação */}
            <div className="flex items-center gap-2 bg-bg-soft-200 rounded-lg px-3 py-2 h-10 w-20 animate-pulse" />
            
            {/* Botão de visualização em lista */}
            <div className="w-10 h-10 bg-bg-soft-200 rounded-lg animate-pulse" />
            
            {/* Botão de visualização em calendário */}
            <div className="w-10 h-10 bg-bg-soft-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Lista de agendamentos */}
      <div className="w-full gap-8 px-8">
        <div className="rounded-lg w-full border border-stroke-soft-200">
          {/* Item 1 */}
          <div className="flex items-center justify-between p-4 hover:bg-bg-weak-50 transition-colors duration-200 bg-bg-white-0 rounded-lg">
            <div className="flex gap-8 cursor-pointer w-full">
              <div className="w-[250px]">
                <div className="h-6 w-32 bg-bg-soft-200 rounded animate-pulse mb-2" />
                <div className="flex items-center gap-2">
                  <div className="w-16 h-6 bg-bg-soft-200 rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-bg-soft-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="items-start">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-20 bg-bg-soft-200 rounded animate-pulse" />
                  <div className="h-5 w-24 bg-bg-soft-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-6 bg-bg-soft-200 rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-bg-soft-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-8 bg-bg-soft-200 rounded animate-pulse" />
              <div className="w-24 h-8 bg-bg-soft-200 rounded animate-pulse" />
              <div className="w-8 h-8 bg-bg-soft-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Divisor */}
          <div className="h-px bg-stroke-soft-200" />

          {/* Item 2 */}
          <div className="flex items-center justify-between p-4 hover:bg-bg-weak-50 transition-colors duration-200 bg-bg-white-0 rounded-lg">
            <div className="flex gap-8 cursor-pointer w-full">
              <div className="w-[250px]">
                <div className="h-6 w-28 bg-bg-soft-200 rounded animate-pulse mb-2" />
                <div className="flex items-center gap-2">
                  <div className="w-16 h-6 bg-bg-soft-200 rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-bg-soft-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="items-start">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-20 bg-bg-soft-200 rounded animate-pulse" />
                  <div className="h-5 w-28 bg-bg-soft-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-6 bg-bg-soft-200 rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-bg-soft-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-8 bg-bg-soft-200 rounded animate-pulse" />
              <div className="w-24 h-8 bg-bg-soft-200 rounded animate-pulse" />
              <div className="w-8 h-8 bg-bg-soft-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Divisor */}
          <div className="h-px bg-stroke-soft-200" />

          {/* Item 3 */}
          <div className="flex items-center justify-between p-4 hover:bg-bg-weak-50 transition-colors duration-200 bg-bg-white-0 rounded-lg">
            <div className="flex gap-8 cursor-pointer w-full">
              <div className="w-[250px]">
                <div className="h-6 w-28 bg-bg-soft-200 rounded animate-pulse mb-2" />
                <div className="flex items-center gap-2">
                  <div className="w-16 h-6 bg-bg-soft-200 rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-bg-soft-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="items-start">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-20 bg-bg-soft-200 rounded animate-pulse" />
                  <div className="h-5 w-24 bg-bg-soft-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-6 bg-bg-soft-200 rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-bg-soft-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-8 bg-bg-soft-200 rounded animate-pulse" />
              <div className="w-24 h-8 bg-bg-soft-200 rounded animate-pulse" />
              <div className="w-8 h-8 bg-bg-soft-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Divisor */}
          <div className="h-px bg-stroke-soft-200" />

          {/* Item 4 */}
          <div className="flex items-center justify-between p-4 hover:bg-bg-weak-50 transition-colors duration-200 bg-bg-white-0 rounded-lg">
            <div className="flex gap-8 cursor-pointer w-full">
              <div className="w-[250px]">
                <div className="h-6 w-32 bg-bg-soft-200 rounded animate-pulse mb-2" />
                <div className="flex items-center gap-2">
                  <div className="w-16 h-6 bg-bg-soft-200 rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-bg-soft-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="items-start">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-20 bg-bg-soft-200 rounded animate-pulse" />
                  <div className="h-5 w-24 bg-bg-soft-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-6 bg-bg-soft-200 rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-bg-soft-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-8 bg-bg-soft-200 rounded animate-pulse" />
              <div className="w-24 h-8 bg-bg-soft-200 rounded animate-pulse" />
              <div className="w-8 h-8 bg-bg-soft-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Divisor */}
          <div className="h-px bg-stroke-soft-200" />

          {/* Item 5 */}
          <div className="flex items-center justify-between p-4 hover:bg-bg-weak-50 transition-colors duration-200 bg-bg-white-0 rounded-lg">
            <div className="flex gap-8 cursor-pointer w-full">
              <div className="w-[250px]">
                <div className="h-6 w-32 bg-bg-soft-200 rounded animate-pulse mb-2" />
                <div className="flex items-center gap-2">
                  <div className="w-16 h-6 bg-bg-soft-200 rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-bg-soft-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="items-start">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-20 bg-bg-soft-200 rounded animate-pulse" />
                  <div className="h-5 w-28 bg-bg-soft-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-6 bg-bg-soft-200 rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-bg-soft-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-8 bg-bg-soft-200 rounded animate-pulse" />
              <div className="w-24 h-8 bg-bg-soft-200 rounded animate-pulse" />
              <div className="w-8 h-8 bg-bg-soft-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
