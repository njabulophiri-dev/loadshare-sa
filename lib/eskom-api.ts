const API_BASE_URL = 'https://developer.sepush.co.za/business/2.0';

export interface AreaInfo {
  id: string;
  name: string;
  region: string;
}

export interface Schedule {
  day: string;
  stages: StageSchedule[];
}

export interface StageSchedule {
  stage: number;
  times: string[];
}

export interface Status {
  area: string;
  schedule: Schedule[];
  currentStage?: number;
  nextStage?: number;
  updated?: string;
}

class EskomAPI {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.ESKOM_SEPUSH_API_KEY || '';
  }

  async searchAreas(searchText: string): Promise<AreaInfo[]> {
    // If no API key, return mock data immediately
    if (!this.apiKey) {
      return this.getMockAreas(searchText);
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/areas_search?text=${encodeURIComponent(searchText)}`,
        {
          headers: {
            'Token': this.apiKey,
          },
        }
      );

      if (!response.ok) {
        console.log('🔍 API search failed, using mock data');
        return this.getMockAreas(searchText);
      }

      const data = await response.json();
      return data.areas || [];
    } catch (error) {
      console.log('🔍 Error searching areas, using mock data');
      return this.getMockAreas(searchText);
    }
  }

  async getStatus(areaId: string): Promise<Status | null> {
    // If no API key, return mock data immediately
    if (!this.apiKey) {
      return this.getMockAreaInfo(areaId);
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/area?id=${areaId}`,
        {
          headers: {
            'Token': this.apiKey,
          },
        }
      );

      if (!response.ok) {
        console.log('⚡ API status failed, using mock data');
        return this.getMockAreaInfo(areaId);
      }

      const data = await response.json();
      return this.transformAreaData(data);
    } catch (error) {
      console.log('⚡ Error fetching status, using mock data');
      return this.getMockAreaInfo(areaId);
    }
  }

  private transformAreaData(data: any): Status {
    // Handle actual API response structure
    if (data && data.area) {
      return {
        area: data.area.name || 'Unknown Area',
        schedule: this.parseSchedule(data.schedule),
        currentStage: data.events?.[0]?.stage,
        nextStage: data.events?.[1]?.stage,
        updated: data.area.updated || new Date().toISOString(),
      };
    }
    
    // Fallback to mock data if structure is unexpected
    return this.getMockAreaInfo('default');
  }

  private parseSchedule(scheduleData: any): Schedule[] {
    if (!scheduleData || !scheduleData.days) {
      return this.getMockAreaInfo('default').schedule;
    }

    return scheduleData.days.map((day: any) => ({
      day: day.date,
      stages: day.stages.map((stage: any, index: number) => ({
        stage: index + 1,
        times: stage || [],
      })),
    }));
  }

  // Mock data for development
  private getMockAreas(searchText: string): AreaInfo[] {
    const allAreas = [
      { id: 'eskde-4-sandton-sandton', name: 'Sandton, Johannesburg', region: 'Gauteng' },
      { id: 'eskde-10-pretoriacentral', name: 'Pretoria Central', region: 'Gauteng' },
      { id: 'eskde-11-cape-town-cbd', name: 'Cape Town CBD', region: 'Western Cape' },
      { id: 'eskde-6-durban-central', name: 'Durban Central', region: 'KwaZulu-Natal' },
      { id: 'eskde-8-springs', name: 'Springs', region: 'Gauteng' },
    ];
    
    return allAreas.filter(area => 
      area.name.toLowerCase().includes(searchText.toLowerCase()) ||
      area.region.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  getMockAreaInfo(areaId: string): Status {
    const areas: { [key: string]: Status } = {
      'eskde-4-sandton-sandton': {
        area: 'Sandton, Johannesburg',
        schedule: [
          {
            day: new Date().toISOString().split('T')[0],
            stages: [
              { stage: 1, times: ['00:00-02:30', '08:00-10:30', '16:00-18:30'] },
              { stage: 2, times: ['00:00-02:30', '08:00-12:30', '16:00-20:30'] },
              { stage: 3, times: ['00:00-04:30', '08:00-12:30', '16:00-20:30'] },
            ],
          },
        ],
        currentStage: 2,
        nextStage: 3,
        updated: new Date().toISOString(),
      },
      'default': {
        area: 'Your Area',
        schedule: [
          {
            day: new Date().toISOString().split('T')[0],
            stages: [
              { stage: 1, times: ['06:00-08:30', '14:00-16:30', '22:00-00:30'] },
              { stage: 2, times: ['06:00-10:30', '14:00-18:30', '22:00-02:30'] },
              { stage: 3, times: ['06:00-12:30', '14:00-20:30', '22:00-04:30'] },
            ],
          },
        ],
        currentStage: 1,
        nextStage: 2,
        updated: new Date().toISOString(),
      }
    };

    return areas[areaId] || areas['default'];
  }
}

export const eskomAPI = new EskomAPI();
