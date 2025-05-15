export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          topic: string
          prompt_type: string
          tone: string
          length: number
          additional_context: string | null
          model: string
          generated_prompt: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          topic: string
          prompt_type: string
          tone: string
          length: number
          additional_context?: string | null
          model: string
          generated_prompt: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          topic?: string
          prompt_type?: string
          tone?: string
          length?: number
          additional_context?: string | null
          model?: string
          generated_prompt?: string
          user_id?: string
          created_at?: string
        }
      }
      code_generations: {
        Row: {
          id: string
          description: string
          language: string
          framework: string
          model: string
          additional_context: string | null
          generated_code: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          description: string
          language: string
          framework: string
          model: string
          additional_context?: string | null
          generated_code: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          description?: string
          language?: string
          framework?: string
          model?: string
          additional_context?: string | null
          generated_code?: string
          user_id?: string
          created_at?: string
        }
      }
      code_reviews: {
        Row: {
          id: string
          code: string
          language: string
          review_type: string
          model: string
          review_result: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          language: string
          review_type: string
          model: string
          review_result: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          language?: string
          review_type?: string
          model?: string
          review_result?: string
          user_id?: string
          created_at?: string
        }
      }
      tests: {
        Row: {
          id: string
          code: string
          language: string
          framework: string
          test_types: string[]
          coverage: string
          model: string
          additional_context: string | null
          generated_tests: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          language: string
          framework: string
          test_types: string[]
          coverage: string
          model: string
          additional_context?: string | null
          generated_tests: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          language?: string
          framework?: string
          test_types?: string[]
          coverage?: string
          model?: string
          additional_context?: string | null
          generated_tests?: string
          user_id?: string
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          description: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          description: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          description?: string
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}
