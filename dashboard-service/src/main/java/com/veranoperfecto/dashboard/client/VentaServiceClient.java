package com.veranoperfecto.dashboard.client;

import com.veranoperfecto.dashboard.dto.InventarioDto;
import java.util.List;

public interface VentaServiceClient {
    long getIngresosMes();
    List<InventarioDto> getAlertasStock();
}
