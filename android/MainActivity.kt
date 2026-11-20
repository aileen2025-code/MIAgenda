package com.ejemplo.miagenda

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Flag
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

// Niveles de prioridad disponibles para cada actividad
enum class Prioridad(val etiqueta: String) {
    BAJA("Baja"),
    MEDIA("Media"),
    ALTA("Alta")
}

// Modelo simple para representar cada actividad en memoria
data class Actividad(
    val id: Int,
    val nombre: String,
    val completada: Boolean = false,
    val prioridad: Prioridad = Prioridad.MEDIA
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                MiAgendaScreen()
            }
        }
    }
}

@Composable
fun MiAgendaScreen() {
    // Estado temporal en memoria (se reinicia al cerrar la app)
    var textoActividad by remember { mutableStateOf("") }
    var prioridadSeleccionada by remember { mutableStateOf(Prioridad.MEDIA) }
    var siguienteId by remember { mutableIntStateOf(3) }
    val actividades = remember {
        mutableStateListOf(
            Actividad(
                id = 1,
                nombre = "Repasar qué es un @Composable",
                completada = false,
                prioridad = Prioridad.ALTA
            ),
            Actividad(
                id = 2,
                nombre = "Probar mi primera lista en Compose",
                completada = true,
                prioridad = Prioridad.BAJA
            )
        )
    }

    Scaffold { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            // 1. Título principal de la pantalla
            Text(
                text = "Mi Agenda",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(16.dp))

            // 2. Campo para escribir una nueva actividad
            OutlinedTextField(
                value = textoActividad,
                onValueChange = { textoActividad = it },
                label = { Text("Escribe una actividad") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            // 3. Selector de nivel de prioridad (Baja, Media, Alta)
            Text(
                text = "Prioridad",
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(6.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Prioridad.entries.forEach { nivel ->
                    FilterChip(
                        selected = prioridadSeleccionada == nivel,
                        onClick = { prioridadSeleccionada = nivel },
                        label = { Text(nivel.etiqueta) },
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 4. Botón para agregar la actividad a la lista
            Button(
                onClick = {
                    val nombreLimpio = textoActividad.trim()
                    if (nombreLimpio.isNotEmpty()) {
                        actividades.add(
                            0,
                            Actividad(
                                id = siguienteId,
                                nombre = nombreLimpio,
                                prioridad = prioridadSeleccionada
                            )
                        )
                        siguienteId++
                        textoActividad = ""
                        prioridadSeleccionada = Prioridad.MEDIA
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Text("Agregar actividad")
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 5. Lista de actividades agregadas
            if (actividades.isEmpty()) {
                Text(
                    text = "Aún no hay actividades. Escribe una arriba y toca \"Agregar actividad\".",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(
                        items = actividades,
                        key = { it.id }
                    ) { actividad ->
                        ActividadItem(
                            actividad = actividad,
                            onCambiarCompletada = { marcada ->
                                val indice = actividades.indexOfFirst { it.id == actividad.id }
                                if (indice != -1) {
                                    actividades[indice] = actividad.copy(completada = marcada)
                                }
                            },
                            onEliminar = {
                                actividades.removeAll { it.id == actividad.id }
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ActividadItem(
    actividad: Actividad,
    onCambiarCompletada: (Boolean) -> Unit,
    onEliminar: () -> Unit
) {
    val colorPrioridad = when {
        actividad.completada -> MaterialTheme.colorScheme.onSurfaceVariant
        actividad.prioridad == Prioridad.ALTA -> Color(0xFFB91C1C)
        actividad.prioridad == Prioridad.MEDIA -> Color(0xFFB45309)
        else -> MaterialTheme.colorScheme.onSurfaceVariant
    }

    Card(
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f)
        ),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 8.dp)
        ) {
            // Control para marcar la actividad como completada
            Checkbox(
                checked = actividad.completada,
                onCheckedChange = onCambiarCompletada
            )

            // Nombre de la actividad y su indicador visual de prioridad
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 8.dp)
            ) {
                Text(
                    text = actividad.nombre,
                    style = MaterialTheme.typography.bodyLarge,
                    textDecoration = if (actividad.completada) {
                        TextDecoration.LineThrough
                    } else {
                        TextDecoration.None
                    }
                )

                Spacer(modifier = Modifier.height(2.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Flag,
                        contentDescription = null,
                        tint = colorPrioridad,
                        modifier = Modifier.size(14.dp)
                    )
                    Text(
                        text = "Prioridad ${actividad.prioridad.etiqueta}",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = if (!actividad.completada && actividad.prioridad != Prioridad.BAJA) {
                            FontWeight.SemiBold
                        } else {
                            FontWeight.Normal
                        },
                        color = colorPrioridad
                    )
                }
            }

            // Botón para eliminar la actividad
            IconButton(onClick = onEliminar) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Eliminar actividad"
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MiAgendaPreview() {
    MaterialTheme {
        MiAgendaScreen()
    }
}
